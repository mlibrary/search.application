module Search
  module Presenters
    module Record
      def self.for_datastore(datastore:, id:)
        case datastore
        when "catalog"
          Catalog::Full.for(id)
        end
      end
    end
  end
end

require "search/presenters/record/catalog"
