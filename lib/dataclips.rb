require "dataclips/engine"

module Dataclips
  mattr_accessor :path, :connection

  def load_clips
    Dir.glob("#{path}/*.sql") do |clip_path|
      clip_id = clip_path.match(/(\w+).sql/)[1]
      sql = read_sql(clip_id)

      klass = Class.new(Clip) do
        @template  = sql.template
        @schema    = sql.schema
        @per_page  = sql.options["per_page"]
        @variables = sql.variables

        attr_accessor *sql.variables.keys

        sql.variables.each do |key, options|
          validates key, presence: true
        end
      end

      Clip.const_set(clip_id.camelize, klass)
    end
  end

  def read_sql(clip_id)
    SQLQuery.new File.read(File.join(path, "#{clip_id}.sql"))
  end

  module_function :load_clips, :read_sql
end
