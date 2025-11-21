class Prescription < ApplicationRecord
  belongs_to :appointment

  validates :medicines, presence: true
end
