module Search::Presenters
  class Advanced
    def self.for(datastore:, uri:, search_options:)
      "Search::Presenters::Advanced::#{datastore.capitalize}".constantize.for(uri:, search_options:)
    end

    def initialize(datastore:, uri:, search_options:)
      @datastore = datastore
      @uri = uri
      @search_options = search_options
    end

    def checked_search_options
      @search_options.first(3)
    end

    def boolean_filters
      []
    end

    def narrow_filter
      []
    end

    def date_filter
      []
    end

    def filters
      []
    end

    def has_additional_options?
      boolean_filters.any? || narrow_filter.any? || date_filter.any? || filters.any?
    end
  end
end

require_relative "results/filters"
require_relative "advanced/everything"
require_relative "advanced/catalog"
require_relative "advanced/articles"
require_relative "advanced/databases"
require_relative "advanced/onlinejournals"
require_relative "advanced/guidesandmore"
