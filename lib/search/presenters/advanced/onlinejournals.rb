class Search::Presenters::Advanced::Onlinejournals < Search::Presenters::Advanced
  def self.for(uri)
    results_model_instance = Search::Models::Advanced::Onlinejournals.for(uri)
    new(results_model_instance)
  end

  def initialize(results)
    @results = results
  end
end
