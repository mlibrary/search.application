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
    all_filters.map do |group|
      first = group.first
      OpenStruct.new(uid: first.uid, name: first.group_name, options: group.reject { |x| x.active? })
    end.select { |x| FILTER_ORDER.include?(x.uid) }.sort_by do |f|
      FILTER_ORDER.index(f.uid)
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

  def records
    @results.records.map do |record|
      Search::Presenters::Record::Catalog::Brief.new(record)
    end
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
