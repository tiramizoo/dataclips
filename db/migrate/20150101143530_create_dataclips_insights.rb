class CreateDataclipsInsights < ActiveRecord::Migration[6.1]
  def change
    create_table :dataclips_insights do |t|
      t.string  :hash_id, null: false

      t.string  :clip_id, null: false
      t.json    :params, null: false, default: {}

      t.boolean :shared, null: false, default: true

      t.string  :checksum, null: false
      t.string  :time_zone, null: false
      t.string  :name, null: false
      t.string  :connection
      t.integer :per_page
      t.datetime :last_viewed_at
      t.timestamps

      t.index ["checksum", "clip_id"], unique: true
      t.index ["hash_id"], name: "index_dataclips_insights_on_hash_id", unique: true
    end
  end
end
