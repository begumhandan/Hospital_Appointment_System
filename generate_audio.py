from gtts import gTTS
import os
import requests
from moviepy import AudioFileClip
import datetime

# Metin parçaları (DEMO_SCRIPT.md dosyasından güncellendi)
segments = [
    "Antigravity Hastane Randevu Sistemine hoş geldiniz. Şu anda ana sayfada mevcut randevuları görüntülüyoruz.",
    "Yeni bir randevu kaydı oluşturmak için üst menüdeki 'Yeni Randevu' butonuna tıklıyoruz.",
    "Açılan formda ilgili doktoru ve hastayı seçiyoruz. Ardından randevu tarihini ve saatini belirliyoruz.",
    "Gerekli bilgileri girdikten sonra 'Randevu Oluştur' butonuna basarak işlemi tamamlıyoruz. Sistem bizi otomatik olarak ana sayfaya yönlendiriyor.",
    "Gördüğünüz gibi, oluşturduğumuz yeni randevu başarıyla listeye eklendi.",
    "Randevunun ayrıntılarını incelemek için ilgili kart üzerindeki 'Detay' butonuna tıklıyoruz.",
    "Bu sayfada hasta, doktor ve randevu durumu gibi tüm detaylı bilgileri görebilirsiniz.",
    "Son olarak, bir randevuyu iptal etmek veya silmek isterseniz 'Sil' fonksiyonunu kullanabilirsiniz.",
    "Beni dinlediğiniz için teşekkür eder. İyi günler dilerim."
]

# ElevenLabs Ayarları
VOICE_ID = "krLzmW3By9JzaVy294Ux"
API_KEY = os.environ.get("ELEVENLABS_API_KEY")

if not API_KEY:
    print("Hata: ELEVENLABS_API_KEY çevre değişkeni bulunamadı.")
    exit(1)

# Çıktı klasörü
output_dir = "voiceovers"
if os.path.exists(output_dir):
    for f in os.listdir(output_dir):
        os.remove(os.path.join(output_dir, f))
else:
    os.makedirs(output_dir)

print("ElevenLabs ile ses dosyaları oluşturuluyor...")

url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
headers = {
    "Accept": "audio/mpeg",
    "Content-Type": "application/json",
    "xi-api-key": API_KEY
}

srt_content = ""
current_time = 0.0

def format_time(seconds):
    td = datetime.timedelta(seconds=seconds)
    # Format: 00:00:00,000
    # datetime.timedelta doesn't have hours if < 1 day, so we format manually
    hours, remainder = divmod(seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    milliseconds = int((seconds - int(seconds)) * 1000)
    return f"{int(hours):02}:{int(minutes):02}:{int(seconds):02},{milliseconds:03}"

for i, text in enumerate(segments):
    try:
        data = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.5}
        }
        
        response = requests.post(url, json=data, headers=headers)
        
        if response.status_code == 200:
            filename = f"{output_dir}/segment_{i+1}.mp3"
            with open(filename, 'wb') as f:
                f.write(response.content)
            print(f"Oluşturuldu: {filename}")
            
            # Süreyi hesapla
            clip = AudioFileClip(filename)
            duration = clip.duration
            clip.close()
            
            start_str = format_time(current_time)
            end_str = format_time(current_time + duration)
            
            srt_content += f"{i+1}\n{start_str} --> {end_str}\n{text}\n\n"
            
            current_time += duration
        else:
            print(f"Hata ({i+1}): {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"Hata ({i+1}): {e}")

with open("subtitles.srt", "w", encoding="utf-8") as f:
    f.write(srt_content)

print("\nİşlem tamamlandı! 'voiceovers' klasörü ve 'subtitles.srt' oluşturuldu.")
