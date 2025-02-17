# https://api.rubyonrails.org/classes/ActiveRecord/ConnectionAdapters/ConnectionPool.html

class Dataclips::InsightsController < Dataclips::ApplicationController
  before_action :find_and_authenticate_insight

  def show; end

  def data
    respond_to do |format|
      format.json do
        @insight.touch(:last_viewed_at)

        template  = File.read("#{Rails.root}/app/dataclips/#{@insight.clip_id}/query.sql")
        clip      = Dataclips::Query.new(template)
        query     = clip.query(@insight.params)
        page      = params['page']&.to_i
        per_page  = @insight.per_page

        if Dataclips::Engine.config.multiple_db
          # MULTIPLE DB - conenction switching
          begin
            pool_config = @insight.connection.present? ? @insight.connection.to_sym : Rails.env.to_sym
            pool = ActiveRecord::Base.connection_handler.establish_connection(pool_config)

            pool.with_connection do |conn|
              render json: retrieve_results(query: query, page: page, per_page: per_page, connection: conn)
            end
          rescue => ex
            raise ex
            Rails.logger.warn ex, ex.backtrace
            head :internal_server_error
          ensure
            pool&.disconnect!
          end
        else
          # SINGLE DB (reports in the same DB as insights)
          render json: retrieve_results(query: query, page: page, per_page: per_page)
        end
      end
    end
  end

  private

  def retrieve_results(query: , page: 1, per_page: nil, connection: ActiveRecord::Base.connection)
    paginator = Dataclips::Paginator.new(query, connection)

    if per_page
      result = paginator.execute_paginated_query(query, page: page, per_page: per_page)

      records = result.pluck('record')

      {
        records: records,
        total_count: (result.first['total_count'] if records.any?),
        page: (result.first['page'] if records.any?) || page,
        total_pages: (result.first['total_pages'] if records.any?)
      }.compact

    else
      result = paginator.execute_query(query)

      {
        records: result.pluck('record'),
        total_count: result.ntuples,
        page: 1,
        total_pages: 1
      }
    end
  end
end
