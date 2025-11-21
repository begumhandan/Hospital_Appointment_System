class Schedule < ApplicationRecord
  belongs_to :doctor

  validates :day, :start_time, :end_time, presence: true
end
