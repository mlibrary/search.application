module Search::Presenters
  class Results
    def self.for(datastore:, uri:)
      "Search::Presenters::Results::#{datastore.capitalize}".constantize.for(uri)
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

  # This will come from model facets
  FIXED_FILTERS = [
    {
      uid: "availability",
      name: "Availability",
      options: [
        {value: "Available Online", count: 15762},
        {value: "Physical", count: 8421},
        {value: "HathiTrust", count: 3245}
      ]
    },
    {
      uid: "format",
      name: "Format",
      options: [
        {value: "Book", count: 11826},
        {value: "Journal", count: 7398},
        {value: "Music", count: 1234},
        {value: "Video", count: 987},
        {value: "Map", count: 456},
        {value: "Manuscript", count: 321},
        {value: "Audio (music)", count: 321}
      ]
    },
    {
      uid: "subject",
      name: "Subject",
      options: [
        {value: "History", count: 6789},
        {value: "Science", count: 5678},
        {value: "Literature", count: 4567},
        {value: "Art", count: 3456},
        {value: "Technology", count: 2345}
      ]
    },
    {
      uid: "date_of_publication",
      name: "Date of Publication",
      options: [
        {value: "2020-2024", count: 3456},
        {value: "2010-2019", count: 5678},
        {value: "2000-2009", count: 4567},
        {value: "1990-1999", count: 2345},
        {value: "1980-1989", count: 1234},
        {value: "1970-1979", count: 1234},
        {value: "1960-1969", count: 1234},
        {value: "Before 1960", count: 6789}
      ]
    },
    {
      uid: "language",
      name: "Language",
      options: [
        {value: "English", count: 14567},
        {value: "Spanish", count: 2345},
        {value: "French", count: 1234},
        {value: "German", count: 987},
        {value: "Chinese", count: 876},
        {value: "Japanese", count: 765},
        {value: "Russian", count: 654}
      ]
    },
    {
      uid: "author",
      name: "Author",
      options: [
        {value: "Smith, John", count: 123},
        {value: "Doe, Jane", count: 98},
        {value: "Brown, Bob", count: 76},
        {value: "Johnson, Alice", count: 54},
        {value: "Davis, Charlie", count: 32}
      ]
    },
    {
      uid: "publisher",
      name: "Publisher",
      options: [
        {value: "Penguin Random House", count: 456},
        {value: "HarperCollins", count: 345},
        {value: "Simon & Schuster", count: 234},
        {value: "Macmillan Publishers", count: 123},
        {value: "Hachette Livre", count: 98}
      ]
    }
  ].map do |filter|
    options = filter[:options].map { |x| OpenStruct.new(value: x[:value], count: x[:count]) }
    OpenStruct.new(uid: filter[:uid], name: filter[:name], options: options)
  end

  def self.records(pagination)
    start = pagination.current_page - 1
    FIXED_RECORD_IDS[start * pagination.limit, 10].map do |id|
      record_data = JSON.parse(File.read("#{S.project_root}/spec/fixtures/results/#{id}.json"))
      Search::Models::Record::Catalog.new(record_data)
    end
  end

  # This should be in the instance here. It should not be part of model::results
  def self.pagination(page)
    total = 24
    limit = 10
    current_page = (page && page > 0) ? page : 1
    start_result = (current_page > 1) ? ((current_page - 1) * limit) + 1 : 1
    end_result = [(start_result + limit) - 1, total].min
    OpenStruct.new(start: start_result, end: end_result, total: total, limit: limit, current_page: current_page)
  end

  def self.for(uri)
    pagination_inst = pagination(uri.query_hash["page"].to_i)
    results_model_instance = OpenStruct.new(filters: FIXED_FILTERS, records: records(pagination_inst), pagination: pagination_inst, originating_uri: uri)
    new(results_model_instance)
  end

  def initialize(results)
    @results = results
  end

  def all_filters
    @all_filters ||= @results.filters.map do |filter|
      filter.options.map do |option|
        Search::Presenters::Results::Filter.for(
          uri: @results.originating_uri, uid: filter.uid, value: option.value, count: option.count
        )
      end
    end
  end

  def boolean_filters
    [
      OpenStruct.new(uid: "search_only", label: "View HathiTrust search-only materials", checked?: false)
    ]
  end

  def active_filters
    all_filters.flatten.select { |x| x.active? }
  end

  def filters
    all_filters.map do |group|
      first = group.first
      OpenStruct.new(uid: first.uid, name: first.group_name, options: group.reject { |x| x.active? })
    end
  end

  def pagination
    @results.pagination
  end

  def records
    @results.records.map do |record|
      Search::Presenters::Record::Catalog::Brief.new(record)
    end
  end
end
