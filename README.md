# Antigravity Hospital Appointment System

## 🏥 Proje Hakkında
Bu proje, modern web teknolojileri kullanılarak geliştirilmiş kapsamlı bir hastane randevu sistemidir. Ruby on Rails ile geliştirilen güçlü bir RESTful API backend'i ve React ile oluşturulmuş kullanıcı dostu bir frontend arayüzünü içerir.

## 🚀 Teknolojiler

### Backend
- **Framework:** Ruby on Rails 7 (API Mode)
- **Dil:** Ruby 3.2.2
- **Veritabanı:** PostgreSQL
- **Test:** RSpec, Cucumber

### Frontend
- **Framework:** React (Vite)
- **Dil:** JavaScript
- **Stil:** Tailwind CSS
- **Test:** Cypress (E2E)

### Diğer
- **Video Üretimi:** Python (MoviePy, ElevenLabs API)
- **Versiyon Kontrol:** Git & GitHub

## 🛠️ Kurulum

### Gereksinimler
- Ruby & Rails
- Node.js & npm
- PostgreSQL
- Python (Video scriptleri için)

### Backend Kurulumu
```bash
cd antigravity_hospital
bundle install
rails db:create db:migrate db:seed
rails s
```

### Frontend Kurulumu
```bash
cd antigravity_hospital_frontend
npm install
npm run dev
```

## 🧪 Testler

### Backend Testleri
```bash
# RSpec (Birim Testleri)
bundle exec rspec

# Cucumber (Davranış Testleri)
bundle exec cucumber
```

### Frontend Testleri
```bash
# Cypress (E2E Testleri)
npx cypress open
# veya
npx cypress run
```

## 🎥 Demo Video
Projenin otomatik oluşturulmuş demo videosu `final_demo_video.mp4` dosyasında bulunabilir. Bu video, Cypress testleri ve [ElevenLabs](https://elevenlabs.io/) yapay zeka seslendirmesi kullanılarak otomatik olarak üretilmiştir.

## 📂 Proje Yapısı
- `/antigravity_hospital`: Rails API Backend kodları
- `/antigravity_hospital_frontend`: React Frontend kodları
- `generate_audio.py`: Seslendirme oluşturma scripti
- `merge_demo.py`: Video ve ses birleştirme scripti
- `PROJECT_REPORT.md`: Detaylı proje raporu

---
✨ **Bu proje Antigravity AI asistanı ile oluşturulmuştur.**
Geliştirici: Begüm Handan Demir
