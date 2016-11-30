class AddSqlToInsights < ActiveRecord::Migration
  def change
    add_column :dataclips_insights, :hash_id, :string
    add_column :dataclips_insights, :query, :text
    add_column :dataclips_insights, :schema, :json
    add_column :dataclips_insights, :per_page, :integer
    add_column :dataclips_insights, :last_viewed_at, :datetime

    add_index :dataclips_insights, :hash_id, unique: true

    Dataclips::Insight.reset_column_information

    hashids = Hashids.new(Rails.application.secrets.secret_key_base, 8)


    Dataclips::Insight.find_each do |d|
      clip = Dataclips::Clip.new(d.clip_id)
      query = clip.query(d.params || {})

      d.update!({
        hash_id: hashids.encode(d.id),
        query:   query,
        schema:  clip.schema.to_json,
        per_page: clip.per_page
      })
    end

    change_column_null :dataclips_insights, :hash_id, false
    change_column_null :dataclips_insights, :query, false
    change_column_null :dataclips_insights, :schema, false

    remove_column :dataclips_insights, :excludes
  end
end