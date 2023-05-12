module Dataclips
  class Insight < ActiveRecord::Base
    class FileNotFound < ArgumentError; end

    validates :clip_id,   presence: true
    validates :hash_id,   presence: true, uniqueness: true
    validates :checksum,  presence: true, uniqueness: {scope: :clip_id}
    validates :time_zone, presence: true
    validates :name,      presence: true
    validates :per_page,  numericality: {greater_than: 0, less_than_or_equal_to: 50_000}, allow_nil: true

    scope :shared, -> { where(shared: true) }

    def to_param
      hash_id
    end

    def self.get!(clip_id, params = {}, options = {})
      options = options.symbolize_keys.slice(:connection, :name, :time_zone, :per_page).with_defaults(
        name: clip_id,
        time_zone: Rails.configuration.time_zone
      )

      checksum = calculate_checksum(params, options)

      if insight = Dataclips::Insight.find_by(clip_id: clip_id, checksum: checksum)
        return insight
      else
        hash_id = SecureRandom.urlsafe_base64(Dataclips::Engine.config.hash_id_length)
        checksum = calculate_checksum(params, options)

        Dataclips::Insight.create!(
          clip_id: clip_id,
          params: params,

          hash_id: hash_id,
          checksum: checksum,

          # options
          time_zone: options[:time_zone],
          name: options[:name],
          per_page: options[:per_page],
          connection: options[:connection]
        )
      end
    end

    def self.calculate_checksum(params, options)
      Digest::MD5.hexdigest({
        params: params,
        options: options
      }.compact_blank.to_s)
    end
  end
end
