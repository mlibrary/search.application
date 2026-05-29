module Search::Models
  class Advanced
    def self.for(datastore:, uri:)
      "Search::Models::Advanced::#{datastore.capitalize}".constantize.for(uri)
    end
  end
end

require "search/models/advanced/everything"
require "search/models/advanced/catalog"
require "search/models/advanced/articles"
require "search/models/advanced/databases"
require "search/models/advanced/onlinejournals"
require "search/models/advanced/guidesandmore"
