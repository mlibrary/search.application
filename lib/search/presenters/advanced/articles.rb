class Search::Presenters::Advanced::Articles < Search::Presenters::Advanced
  def self.for(uri)
    results_model_instance = Search::Models::Advanced::Articles.for(uri)
    new(results_model_instance)
  end

  def initialize(results)
    @results = results
  end
end
