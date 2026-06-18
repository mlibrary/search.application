require_relative "catalog"

module Search
  module Presenters
    module Record
      module Onlinejournals
        CATALOG_PRESENTER = Search::Presenters::Record::Catalog
      end
    end
  end
end

require_relative "onlinejournals/holdings"

module Search
  module Presenters
    module Record
      module Onlinejournals
        class Full < CATALOG_PRESENTER::Full
          def datastore
            "onlinejournals"
          end

          def url
            "#{S.base_url}/onlinejournals/record/#{id}"
          end

          def shelf_browse
            nil
          end

          def holdings
            Holdings.new(@record)
          end
        end

        class Brief < CATALOG_PRESENTER::Brief
          METADATA_METHODS = [
            :contributors,
            :published,
            :summary
          ]

          def datastore
            "onlinejournals"
          end

          def holdings
            Holdings.new(@record)
          end
        end
      end
    end
  end
end
require_relative "onlinejournals/email"
