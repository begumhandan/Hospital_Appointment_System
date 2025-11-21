class CreatePrescriptions < ActiveRecord::Migration[8.0]
  def change
    create_table :prescriptions do |t|
      t.references :appointment, null: false, foreign_key: true
      t.text :medicines
      t.text :notes

      t.timestamps
    end
  end
end
