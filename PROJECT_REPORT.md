# Gravity Agent Görev Raporu — HASTANE RANDEVU SİSTEMİ

## 1. Sistem Analizi

### Gereksinim Analizi
Antigravity Hospital Randevu Sistemi, hastaların doktorlardan randevu alabildiği, doktorların programlarını yönetebildiği ve reçete yazabildiği kapsamlı bir yönetim sistemidir. Sistem, RESTful API mimarisi üzerine kurulu backend ve modern React frontend'den oluşur.

### Kullanıcı Hikayeleri
- **Hasta**: Sistemdeki doktorları ve bölümleri listeleyebilir, uygun saatlere randevu alabilir, randevularını görüntüleyebilir ve iptal edebilir.
- **Doktor**: Kendi çalışma saatlerini (schedule) düzenleyebilir, randevularını görebilir ve tamamlanan randevulara reçete yazabilir.
- **Yönetici**: Bölüm, doktor ve hasta kayıtlarını yönetebilir (CRUD).

### Genel İş Akışı
1.  Yönetici bölümleri ve doktorları sisteme ekler.
2.  Doktorlar müsaitlik durumlarını (Schedule) girer.
3.  Hasta sisteme kayıt olur veya giriş yapar.
4.  Hasta bölüm ve doktor seçerek uygun bir saat için randevu oluşturur.
5.  Randevu "Bekliyor" statüsünde oluşur.
6.  Doktor randevuyu görüntüler ve muayene sonrası "Tamamlandı" olarak işaretler.
7.  Doktor reçete oluşturur.

---

## 2. API Endpoint Tasarımı

Base URL: `/api`

### Departments
- `GET /departments`: Tüm bölümleri listele
- `POST /departments`: Yeni bölüm ekle
- `GET /departments/:id`: Bölüm detayı
- `PUT /departments/:id`: Bölüm güncelle
- `DELETE /departments/:id`: Bölüm sil

### Doctors
- `GET /doctors`: Tüm doktorları listele (Department ilişkisi ile)
- `POST /doctors`: Yeni doktor ekle
- `GET /doctors/:id`: Doktor detayı
- `PUT /doctors/:id`: Doktor güncelle
- `DELETE /doctors/:id`: Doktor sil

### Patients
- `GET /patients`: Tüm hastaları listele
- `POST /patients`: Yeni hasta ekle
- `GET /patients/:id`: Hasta detayı
- `PUT /patients/:id`: Hasta güncelle
- `DELETE /patients/:id`: Hasta sil

### Schedules
- `GET /schedules`: Çalışma saatlerini listele
- `POST /schedules`: Yeni çalışma saati ekle
- `GET /schedules/:id`: Detay
- `PUT /schedules/:id`: Güncelle
- `DELETE /schedules/:id`: Sil

### Appointments
- `GET /appointments`: Randevuları listele
- `POST /appointments`: Randevu oluştur
- `GET /appointments/:id`: Randevu detayı
- `PUT /appointments/:id`: Randevu güncelle (Statüs değişimi)
- `DELETE /appointments/:id`: Randevu iptal/sil

### Prescriptions
- `GET /prescriptions`: Reçeteleri listele
- `POST /prescriptions`: Reçete yaz
- `GET /prescriptions/:id`: Reçete detayı
- `PUT /prescriptions/:id`: Reçete güncelle
- `DELETE /prescriptions/:id`: Reçete sil

---

## 3. Modeller ve Veritabanı

### ER Diyagramı (ASCII)
```
Department
    |
    +--< Doctor
           |
           +--< Schedule
           |
           +--< Appointment >--+
                   |           |
                   |        Patient
                   |
              Prescription
```

### Modeller (`app/models/*.rb`)

**Department**
```ruby
class Department < ApplicationRecord
  has_many :doctors, dependent: :destroy
  validates :name, presence: true
end
```

**Doctor**
```ruby
class Doctor < ApplicationRecord
  belongs_to :department
  has_many :schedules, dependent: :destroy
  has_many :appointments, dependent: :destroy
  validates :first_name, :last_name, presence: true
end
```

**Patient**
```ruby
class Patient < ApplicationRecord
  has_many :appointments, dependent: :destroy
  validates :first_name, :last_name, :tc_number, :phone, presence: true
  validates :tc_number, uniqueness: true, length: { is: 11 }
end
```

**Schedule**
```ruby
class Schedule < ApplicationRecord
  belongs_to :doctor
  validates :day, :start_time, :end_time, presence: true
end
```

**Appointment**
```ruby
class Appointment < ApplicationRecord
  belongs_to :doctor
  belongs_to :patient
  has_one :prescription, dependent: :destroy
  validates :appointment_date, presence: true
  validates :status, presence: true
end
```

**Prescription**
```ruby
class Prescription < ApplicationRecord
  belongs_to :appointment
  validates :medicines, presence: true
end
```

### Migration Dosyaları
(Özet: `rails g model` komutları ile oluşturulan standart migration dosyalarıdır. `db/migrate` klasöründe yer alırlar.)

---

## 4. Rails Kurulum Adımları

1.  **Versiyon Kontrolü**:
    ```bash
    ruby -v
    rails -v
    bundle -v
    ```

2.  **Proje Oluşturma**:
    ```bash
    rails new antigravity_hospital --api -d postgresql
    cd antigravity_hospital
    ```

3.  **Gemfile Ekleme**:
    ```ruby
    # Gemfile
    gem 'rspec-rails', group: [:development, :test]
    gem 'cucumber-rails', require: false, group: :test
    gem 'database_cleaner'
    gem 'factory_bot_rails'
    gem 'faker'
    ```

4.  **Veritabanı Kurulumu**:
    ```bash
    # config/database.yml ayarları yapıldıktan sonra
    rails db:create
    rails db:migrate
    ```

5.  **Sunucu Başlatma**:
    ```bash
    rails s
    ```

---

## 5. Controller’lar ve CRUD İşlemleri

**api/appointments_controller.rb**
```ruby
class Api::AppointmentsController < ApplicationController
  before_action :set_appointment, only: %i[ show update destroy ]

  def index
    @appointments = Appointment.all
    render json: @appointments, include: [:doctor, :patient]
  end

  def show
    render json: @appointment, include: [:doctor, :patient, :prescription]
  end

  def create
    @appointment = Appointment.new(appointment_params)
    if @appointment.save
      render json: @appointment, status: :created, location: api_appointment_url(@appointment)
    else
      render json: @appointment.errors, status: :unprocessable_entity
    end
  end

  def update
    if @appointment.update(appointment_params)
      render json: @appointment
    else
      render json: @appointment.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @appointment.destroy
  end

  private
    def set_appointment
      @appointment = Appointment.find(params[:id])
    end

    def appointment_params
      params.require(:appointment).permit(:doctor_id, :patient_id, :appointment_date, :status)
    end
end
```
*(Diğer controllerlar benzer yapıdadır ve proje dosyalarında mevcuttur.)*

**config/routes.rb**
```ruby
Rails.application.routes.draw do
  namespace :api do
    resources :departments
    resources :doctors
    resources :patients
    resources :schedules
    resources :appointments
    resources :prescriptions
  end
end
```

---

## 6. Seeds (`db/seeds.rb`)

```ruby
# ... (Önceki verileri temizleme kodları)

# Departments
cardiology = Department.create!(name: "Kardiyoloji")
# ...

# Doctors
doctor1 = Doctor.create!(first_name: "Ahmet", last_name: "Yılmaz", department: cardiology)
# ...

# Patients
patient1 = Patient.create!(first_name: "Ali", last_name: "Veli", tc_number: "11111111111", phone: "5551112233")
# ...

# Appointments
Appointment.create!(doctor: doctor1, patient: patient1, appointment_date: DateTime.now + 1.day, status: "Bekliyor")
# ...
```

---

## 7. Postman Test Planı

Dosya: `postman_test_plan.md`
- CRUD işlemleri için request örnekleri.
- Test scriptleri (Status 200, JSON body kontrolü).

---

## 8. RSpec & Codex Test Üretimi

**spec/models/appointment_spec.rb**
```ruby
require 'rails_helper'

RSpec.describe Appointment, type: :model do
  # ... (let tanımları)

  it "is valid with valid attributes" do
    expect(subject).to be_valid
  end
  
  # ... (validasyon testleri)
end
```

**Codex Prompt Örneği**:
> "Appointment modeli için RSpec testleri yaz. Doctor ve Patient ilişkilerini ve presence validasyonlarını test et."

---

## 9. Cucumber BDD

**features/appointments.feature**
```gherkin
Feature: Appointment Management
  Scenario: Create a new appointment
    Given I have a doctor named "Ahmet Yılmaz"
    And I have a patient named "Ali Veli"
    When I create an appointment for "Ali Veli" with "Ahmet Yılmaz" on "2023-12-25 10:00:00"
    Then the appointment should be successfully created
```

---

## 10. Gravity Frontend (React + Tailwind)

**Dosya Yapısı**:
- `src/App.jsx`: Routing
- `src/components/AppointmentList.jsx`: Listeleme
- `src/components/AppointmentForm.jsx`: Ekleme/Düzenleme
- `src/components/AppointmentDetail.jsx`: Detay

**Örnek API Fetch (AppointmentList.jsx)**:
```javascript
const fetchAppointments = async () => {
  const response = await axios.get('http://localhost:3000/api/appointments');
  setAppointments(response.data);
};
```

---

## 11. Cypress Frontend E2E Testleri

**cypress/e2e/appointments.cy.js**
```javascript
describe('Appointment System E2E', () => {
  it('should create a new appointment', () => {
    cy.visit('/');
    cy.contains('Yeni Randevu').click();
    // ... form doldurma ve submit
    cy.contains('2023-12-25').should('exist');
  });
});
```

**cypress.config.js**
```javascript
module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    video: true, // Video kaydı açık
  },
});
```

---

## 12. Proje Klasör Yapısı

```
antigravity_hospital/
├── app/
│   ├── controllers/api/
│   ├── models/
├── config/
├── db/
├── spec/
├── features/
└── ...

antigravity_hospital_frontend/
├── src/
│   ├── components/
│   ├── App.jsx
├── cypress/
│   ├── e2e/
├── tailwind.config.js
└── ...
```
## 13. Demo Video ve Dağıtım

### Demo Video Üretimi
Proje tanıtımı için otomatik bir demo videosu oluşturulmuştur.
- **Araçlar**: Cypress (Görsel kayıt), ElevenLabs (Seslendirme), MoviePy (Birleştirme), FFmpeg (Altyazı).
- **Süreç**:
    1.  `cypress/e2e/appointments.cy.js` testi çalıştırılarak görsel akış kaydedildi.
    2.  `generate_audio.py` scripti ile [ElevenLabs](https://elevenlabs.io/) API kullanılarak profesyonel seslendirme (Voice ID: `krLzmW3By9JzaVy294Ux`) oluşturuldu.
    3.  Ses dosyaları ile senkronize `.srt` altyazı dosyası üretildi.
    4.  `merge_demo.py` scripti ile video, ses ve altyazılar birleştirildi.

### GitHub Deposu
Proje kaynak kodları ve dokümantasyonu GitHub üzerinde paylaşılmıştır:
[https://github.com/begumhandan/Antigravity_Hospital_System](https://github.com/begumhandan/Antigravity_Hospital_System)

---
✨ **Bu proje Antigravity AI asistanı ile oluşturulmuştur.**
Geliştirici: Begüm Handan
