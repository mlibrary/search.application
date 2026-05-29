class Search::Presenters::Advanced::Databases < Search::Presenters::Advanced
  def self.for(uri)
    results_model_instance = Search::Models::Advanced::Databases.for(uri)
    new(results_model_instance)
  end

  def initialize(results)
    @results = results
  end
end
