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

  SORT_OPTIONS = [
    {uid: "relevance", name: "Relevance"},
    {uid: "date_asc", name: "Published/Created Date (oldest first)"},
    {uid: "date_desc", name: "Published/Created Date (newest first)"},
    {uid: "author_asc", name: "Author (A-Z)"},
    {uid: "author_desc", name: "Author (Z-A)"},
    {uid: "date_added", name: "Date added (Newest First)"},
    {uid: "title_asc", name: "Title (A-Z)"},
    {uid: "title_desc", name: "Title (Z-A)"}
  ]
  def self.for(uri)
    results_model_instance = Search::Models::Results::Catalog.for(uri)
    specialists = if results_model_instance.pagination.offset == 0
      Search::Models::Specialists.for_catalog(uri)
    else
      []
    end
    new(results_model_instance, specialists)
  end

  attr_reader :specialists

  def initialize(results, specialists = [])
    @results = results
    @specialists = specialists
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

  def sort_options
    SORT_OPTIONS.map do |option|
      SortOption.new(**option, uri: @results.originating_uri)
    end
  end

  def show_specialists?(index)
    if pagination.offset == 0 && specialists_count > 0
      index == if records_count < 3
        records_count - 1
      else
        2
      end
    else
      false
    end
  end

  def records
    @results.records.map do |record|
      Search::Presenters::Record::Catalog::Brief.new(record)
    end
  end

  def records_count
    @records_count ||= @results.records.count
  end

  def specialists_count
    @specialists_count ||= @specialists.count
  end

  class SortOption
    attr_reader :uid, :name
    def initialize(uid:, name:, uri:)
      @uid = uid
      @name = name
      @uri = uri
    end

    def selected
      # This will take the first of the sort matches
      sort_value = (@uri.query_values || {})["sort"]
      if (sort_value.nil? && uid == "relevance") || sort_value == uid
        "selected"
      else
        ""
      end
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

  def self.for(uri)
    results_model_instance = Search::Models::Results::Onlinejournals.for(uri)
    specialists = if results_model_instance.pagination.offset == 0
      Search::Models::Specialists.for_onlinejournals(uri)
    else
      []
    end
    new(results_model_instance, specialists)
  end

  def boolean_filters
    []
  end

  def records
    @results.records.map do |record|
      Search::Presenters::Record::Onlinejournals::Brief.new(record)
    end
  end
end
