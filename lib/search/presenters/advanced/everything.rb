class Search::Presenters::Advanced::Everything < Search::Presenters::Advanced
  def self.for(uri)
    results_model_instance = Search::Models::Advanced::Everything.for(uri)
    new(results_model_instance)
  end

  def initialize(results)
    @results = results
  end
end
