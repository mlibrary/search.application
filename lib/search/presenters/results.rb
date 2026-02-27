module Search::Presenters
  class Results
    def self.for(datastore:, params:)
      "Search::Presenters::Results::#{datastore.capitalize}".constantize.for(params)
    end
  end
end
require_relative "results/filters"

class Search::Presenters::Results::Catalog
  FIXED_RECORD_IDS = [
    990038939650106381,
    990006758990106381,
    99187579295006381,
    990040646010106381,
    11102699205,
    11100320512,
    11100323049,
    11010551022,
    11011665129,
    990008570110106381,
    990008570170106381,
    990008570210106381,
    990008570040106381,
    990008839630106381,
    99187591950506381,
    99187482531606381,
    99187422679306381,
    11100372386,
    99187272754306381,
    99188902815106381,
    990015014190106381,
    990043272160106381,
    990039822770106381,
    990024357620106381
  ]
  FIXED_RECORDS = FIXED_RECORD_IDS.map do |id|
    record_data = JSON.parse(File.read("#{S.project_root}/spec/fixtures/results/#{id}.json"))
    Search::Presenters::Record::Catalog::Brief.new(
      Search::Models::Record::Catalog.new(record_data)
    )
  end
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

  def records
    start = pagination.current_page - 1
    FIXED_RECORDS[start * pagination.limit, 10]
  end
end
