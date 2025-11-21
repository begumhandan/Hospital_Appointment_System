class Doctor < ApplicationRecord
  belongs_to :department
  has_many :schedules, dependent: :destroy
  has_many :appointments, dependent: :destroy

  validates :first_name, :last_name, presence: true
end
