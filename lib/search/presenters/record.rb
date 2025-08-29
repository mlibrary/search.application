module Search
  module Presenters
    module Record
      def self.for_datastore(datastore:, id:, size: "full")
        "Search::Presenters::Record::#{datastore.capitalize}::#{size.capitalize}".constantize.for(id)
      end
    end
  end
end

require "search/presenters/record/catalog"
