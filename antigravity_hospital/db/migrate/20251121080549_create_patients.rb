class CreatePatients < ActiveRecord::Migration[8.0]
  def change
    create_table :patients do |t|
      t.string :first_name
      t.string :last_name
      t.string :tc_number
      t.string :phone

      t.timestamps
    end
  end
end
