module Search::Presenters
  class Advanced
    def self.for(datastore:, uri:)
      "Search::Presenters::Advanced::#{datastore.capitalize}".constantize.for(uri)
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
