class Patient < ApplicationRecord
  has_many :appointments, dependent: :destroy

  validates :first_name, :last_name, :tc_number, :phone, presence: true
  validates :tc_number, uniqueness: true, length: { is: 11 }
end
