# Clear existing data
Prescription.destroy_all
Appointment.destroy_all
Schedule.destroy_all
Doctor.destroy_all
Patient.destroy_all
Department.destroy_all

# Departments
cardiology = Department.create!(name: "Kardiyoloji")
neurology = Department.create!(name: "Nöroloji")
orthopedics = Department.create!(name: "Ortopedi")

# Doctors
doctor1 = Doctor.create!(first_name: "Ahmet", last_name: "Yılmaz", department: cardiology)
doctor2 = Doctor.create!(first_name: "Ayşe", last_name: "Demir", department: neurology)
doctor3 = Doctor.create!(first_name: "Mehmet", last_name: "Kaya", department: orthopedics)

# Patients
patient1 = Patient.create!(first_name: "Ali", last_name: "Veli", tc_number: "11111111111", phone: "5551112233")
patient2 = Patient.create!(first_name: "Zeynep", last_name: "Şahin", tc_number: "22222222222", phone: "5554445566")
patient3 = Patient.create!(first_name: "Fatma", last_name: "Öztürk", tc_number: "33333333333", phone: "5557778899")

# Schedules
Schedule.create!(doctor: doctor1, day: "Pazartesi", start_time: "09:00", end_time: "17:00")
Schedule.create!(doctor: doctor1, day: "Çarşamba", start_time: "09:00", end_time: "17:00")
Schedule.create!(doctor: doctor2, day: "Salı", start_time: "10:00", end_time: "16:00")
Schedule.create!(doctor: doctor2, day: "Perşembe", start_time: "10:00", end_time: "16:00")
Schedule.create!(doctor: doctor3, day: "Cuma", start_time: "08:00", end_time: "15:00")

# Appointments
Appointment.create!(doctor: doctor1, patient: patient1, appointment_date: DateTime.now + 1.day, status: "Bekliyor")
Appointment.create!(doctor: doctor2, patient: patient2, appointment_date: DateTime.now + 2.days, status: "Onaylandı")
Appointment.create!(doctor: doctor3, patient: patient3, appointment_date: DateTime.now + 3.days, status: "Tamamlandı")

puts "Seed data created successfully!"
