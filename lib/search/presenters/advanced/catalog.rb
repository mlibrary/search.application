require "search/models/advanced/catalog"

class Search::Presenters::Advanced::Catalog < Search::Presenters::Advanced
  def self.for(uri)
    results_model_instance = Search::Models::Advanced::Catalog.for(uri)
    new(results_model_instance)
  end

  def initialize(results)
    @results = results
  end
end
