module Search::Presenters
  class Results
    def self.for(datastore:, params:)
      "Search::Presenters::Results::#{datastore.capitalize}".constantize.for(params)
    end
  end
end
require_relative "results/filters"

class Search::Presenters::Results::Catalog
  def self.pagination(page)
    total = 24
    limit = 10
    current_page = (page && page > 0) ? page : 1
    start_result = (current_page > 1) ? ((current_page - 1) * limit) + 1 : 1
    end_result = [(start_result + limit) - 1, total].min
    OpenStruct.new(start: start_result, end: end_result, total: total, limit: limit, current_page: current_page)
  end

  def self.for(params)
    results_model_instance = OpenStruct.new(filters: [], records: [], pagination: pagination(params["page"].to_i))
    new(results_model_instance)
  end

  def initialize(results)
    @results = results
  end

  def pagination
    @results.pagination
  end
end
