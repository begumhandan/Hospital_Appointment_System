Given('I have a doctor named {string}') do |name|
  first, last = name.split(' ')
  @department = Department.create!(name: "General")
  @doctor = Doctor.create!(first_name: first, last_name: last, department: @department)
end

Given('I have a patient named {string}') do |name|
  first, last = name.split(' ')
  @patient = Patient.create!(first_name: first, last_name: last, tc_number: "12345678901", phone: "5551234567")
end

When('I create an appointment for {string} with {string} on {string}') do |patient_name, doctor_name, date|
  @appointment = Appointment.create!(
    doctor: @doctor,
    patient: @patient,
    appointment_date: DateTime.parse(date),
    status: "Bekliyor"
  )
end

Then('the appointment should be successfully created') do
  expect(@appointment).to be_persisted
end

Then('the appointment status should be {string}') do |status|
  expect(@appointment.status).to eq(status)
end
