class Search::Presenters::Advanced::Everything < Search::Presenters::Advanced
  def self.for(uri:, search_options:)
    results_model_instance = Search::Models::Advanced::Everything.for(uri)
    new(results: results_model_instance, search_options: search_options)
  end

  def initialize(results:, search_options:)
    @results = results
    @search_options = search_options
  end
end
