require_relative "catalog"

module Search
  module Presenters
    module Record
      module Onlinejournals
      end
    end
  end
end

require_relative "onlinejournals/holdings"

module Search
  module Presenters
    module Record
      module Onlinejournals
        class Full < Search::Presenters::Record::Catalog::Full
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

        class Brief < Search::Presenters::Record::Catalog::Brief
          METADATA_METHODS = [
            :contributors,
            :published,
            :summary
          ]
        end

        class Field < Search::Presenters::Record::Catalog::Field
        end
      end
    end
  end
end
