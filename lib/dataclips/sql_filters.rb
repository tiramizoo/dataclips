module Dataclips::SqlFilters
  def quote_literals(input)
    input.map { |item| item.is_a?(String) ? "'#{item}'" : item }
  end
end

Liquid::Template.register_filter(Dataclips::SqlFilters)
