class Appointment < ApplicationRecord
  belongs_to :doctor
  belongs_to :patient
  has_one :prescription, dependent: :destroy

  validates :appointment_date, presence: true
  validates :status, presence: true
end
