class CreateDoctors < ActiveRecord::Migration[8.0]
  def change
    create_table :doctors do |t|
      t.string :first_name
      t.string :last_name
      t.references :department, null: false, foreign_key: true

      t.timestamps
    end
  end
end
