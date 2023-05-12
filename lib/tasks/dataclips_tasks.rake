namespace :dataclips do
  desc "HealthCheck"
  task health_check: :environment do
    Dataclips::Insight.distinct.pluck(:clip_id).each do |clip_id|
      if Dataclips::QueryTemplate.all.exclude?(clip_id)
        puts "#{clip_id}/query.sql ... NOT FOUND"
      else
        puts "#{clip_id}/query.sql ... OK"
      end
    end
  end
end
