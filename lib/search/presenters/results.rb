module Search::Presenters
  class Results
    def self.for(datastore:, uri:)
      "Search::Presenters::Results::#{datastore.capitalize}".constantize.for(uri)
    end
  end
end
require_relative "results/filters"

class Search::Presenters::Results::Catalog
  FILTER_ORDER = [
    "availability",
    "format",
    "subject",
    "date_of_publication",
    "language",
    "location",
    "academic_discipline",
    "author",
    "place_of_publication",
    "region",
    "collection"
  ]
  def self.for(uri)
    results_model_instance = Search::Models::Results::Catalog.for(uri)
    new(results_model_instance)
  end

  def initialize(results)
    @results = results
  end

  def all_filters
    @all_filters ||= @results.filters.map do |filter|
      filter.values.map do |v|
        Search::Presenters::Results::Filter.for(
          uri: @results.originating_uri, uid: filter.field, value: v.value, count: v.count
        )
      end
    end
  end

  def boolean_filters
    [
      Search::Presenters::Results::BooleanFilter.for(
        uri: @results.originating_uri, uid: "search_only", default: "false", label: "View HathiTrust search-only materials"
      )
    ]
  end

  def active_filters
    all_filters.flatten.select { |x| x.active? }
  end

  def filters
    filter_order = self.class::FILTER_ORDER
    all_filters.map do |group|
      first = group.first
      OpenStruct.new(uid: first.uid, name: first.group_name, options: group.reject { |x| x.active? })
    end.select { |x| filter_order.include?(x.uid) }.sort_by do |f|
      filter_order.index(f.uid)
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

class Search::Presenters::Results::Onlinejournals < Search::Presenters::Results::Catalog
  FILTER_ORDER = [
    "subject",
    "language",
    "place_of_publication",
    "academic_discipline"
  ]

  def boolean_filters
    []
  end

  def records
    @results.records.map do |record|
      Search::Presenters::Record::Onlinejournals::Brief.new(record)
    end
  end
end
