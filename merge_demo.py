from moviepy import VideoFileClip, AudioFileClip, concatenate_audioclips
import os

video_path = "antigravity_hospital_frontend/cypress/videos/appointments.cy.js.mp4"
audio_dir = "voiceovers"
output_path = "final_demo_video.mp4"

if not os.path.exists(video_path):
    print(f"Hata: Video dosyası bulunamadı: {video_path}")
    exit(1)

if not os.path.exists(audio_dir):
    print(f"Hata: Ses klasörü bulunamadı: {audio_dir}")
    exit(1)

print("Video ve sesler birleştiriliyor...")

try:
    video = VideoFileClip(video_path)
    
    # Ses dosyalarını sırayla al
    audio_files = sorted([f for f in os.listdir(audio_dir) if f.endswith(".mp3")])
    if not audio_files:
        print("Hata: Hiç ses dosyası bulunamadı.")
        exit(1)

    clips = []
    for f in audio_files:
        clips.append(AudioFileClip(os.path.join(audio_dir, f)))

    # Sesleri birleştir
    final_audio = concatenate_audioclips(clips)
    
    # Videonun süresine göre sesi ayarla (gerekirse)
    # Eğer ses videodan uzunsa, video dondurulabilir veya ses kesilebilir.
    # Şimdilik sesi videoya ekliyoruz, süre uyumsuzluğu olabilir.
    
    # Videonun orijinal sesini kaldırıp yeni sesi ekle
    final_video = video.with_audio(final_audio)
    
    # Eğer ses videodan kısaysa video devam eder (sessiz).
    # Eğer ses videodan uzunsa video biter, ses devam eder (player'a göre değişir, genelde video süresi baz alınır).
    # Video süresini ses süresine eşitlemek için:
    if final_audio.duration > video.duration:
        print(f"Uyarı: Ses süresi ({final_audio.duration}s) videodan ({video.duration}s) uzun.")
        # Videoyu uzatmak zor, olduğu gibi bırakıyoruz.
    
    # Ara video dosyası (altyazısız)
    temp_output = "temp_video_with_audio.mp4"
    final_video.write_videofile(temp_output, codec="libx264", audio_codec="aac")
    
    # Altyazı ekleme (ffmpeg ile)
    import imageio_ffmpeg
    import subprocess
    
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    srt_path = "subtitles.srt"
    
    # Windows için path düzeltmesi (ffmpeg filtresi için)
    srt_path_escaped = srt_path.replace("\\", "/").replace(":", "\\:")
    
    print("Altyazılar ekleniyor...")
    
    # FFmpeg komutu
    # force_style ile altyazı stili: Fontsize 24, Beyaz yazı, Siyah arka plan kutusu
    cmd = [
        ffmpeg_exe,
        "-y", # Üzerine yaz
        "-i", temp_output,
        "-vf", f"subtitles={srt_path_escaped}:force_style='Fontsize=18,PrimaryColour=&H00FFFFFF,BackColour=&H80000000,BorderStyle=3,Outline=1,Shadow=0,MarginV=20'",
        "-c:a", "copy",
        output_path
    ]
    
    subprocess.run(cmd, check=True)
    
    # Geçici dosyayı sil
    if os.path.exists(temp_output):
        os.remove(temp_output)
        
    print(f"Başarılı! Video oluşturuldu: {output_path}")

except Exception as e:
    print(f"Bir hata oluştu: {e}")
