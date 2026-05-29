class Search::Presenters::Advanced::Guidesandmore < Search::Presenters::Advanced
  def self.for(uri)
    results_model_instance = Search::Models::Advanced::Guidesandmore.for(uri)
    new(results_model_instance)
  end

  def initialize(results)
    @results = results
  end
end
