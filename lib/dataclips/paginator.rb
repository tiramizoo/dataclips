class Dataclips::Paginator
  attr_accessor :query, :connection

  def initialize(query, connection)
    @query      = query
    @connection = connection
  end

  def records
    execute_query(query).map do |r|
      JSON.parse(r['record'], max_nesting: 1) # it's flat structure
    end
  end

  def execute_query(query)
    connection.execute <<-SQL
      SET intervalstyle = 'iso_8601';
      SELECT row_to_json(insight) AS record FROM (#{query}) insight;
    SQL
  end

  def execute_paginated_query(query, page: 1, per_page: 10_000)
    offset = (page - 1) * per_page

    connection.execute <<-SQL
      SET intervalstyle = 'iso_8601';
      WITH insight AS MATERIALIZED (#{query}), stats AS MATERIALIZED (
        SELECT #{page} AS page, COUNT(*) AS total_count, CEIL(COUNT(*) / #{per_page}::numeric) AS total_pages FROM insight
      )

      SELECT stats.*, row_to_json(insight) AS record FROM stats, insight OFFSET #{offset} LIMIT #{per_page};
    SQL
  end
end
