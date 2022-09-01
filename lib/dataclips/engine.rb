module Dataclips
  class Engine < ::Rails::Engine
    isolate_namespace Dataclips

    config.before_configuration do
      config.path           = Rails.root.join('app/dataclips').to_s
      config.hash_id_length = 8
      config.multiple_db    = false
    end

    initializer "dataclips.assets" do
      if Rails.application.config.respond_to?(:assets)
        Rails.application.config.assets.precompile += %w[dataclips/dist/reactable-bundle.js dataclips/dist/dataclips-bundle.js]
      end
    end
  end
end
