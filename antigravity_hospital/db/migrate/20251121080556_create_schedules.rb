class CreateSchedules < ActiveRecord::Migration[8.0]
  def change
    create_table :schedules do |t|
      t.references :doctor, null: false, foreign_key: true
      t.string :day
      t.time :start_time
      t.time :end_time

      t.timestamps
    end
  end
end
