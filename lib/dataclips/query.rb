class Dataclips::Query
  def initialize(sql_template)
    @template  = Liquid::Template.parse(sql_template)
  end

  def query(params = {})
    @template.render(params.with_indifferent_access)
  end
end
