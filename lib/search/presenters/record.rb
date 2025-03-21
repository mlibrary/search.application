module Search
  module Presenters
    module Record
      def for_datastore(datastore:, id:)
        case datastore
        when "catalog"
          Catalog.for(id)
        end
      end
    end
  end
end

require "search/presenters/record/catalog"
