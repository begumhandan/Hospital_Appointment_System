require 'rails_helper'

RSpec.describe Appointment, type: :model do
  let(:department) { Department.create(name: "Kardiyoloji") }
  let(:doctor) { Doctor.create(first_name: "Ahmet", last_name: "Yılmaz", department: department) }
  let(:patient) { Patient.create(first_name: "Ali", last_name: "Veli", tc_number: "11111111111", phone: "5551112233") }
  
  subject { 
    described_class.new(
      doctor: doctor, 
      patient: patient, 
      appointment_date: DateTime.now + 1.day, 
      status: "Bekliyor"
    ) 
  }

  it "is valid with valid attributes" do
    expect(subject).to be_valid
  end

  it "is not valid without a doctor" do
    subject.doctor = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a patient" do
    subject.patient = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without an appointment_date" do
    subject.appointment_date = nil
    expect(subject).to_not be_valid
  end

  it "is not valid without a status" do
    subject.status = nil
    expect(subject).to_not be_valid
  end
end
