require_relative "catalog"

module Search
  module Presenters
    module Record
      module Onlinejournals
      end
    end
  end
end

module Search
  module Presenters
    module Record
      module Onlinejournals
        class Base  < Search::Presenters::Record::Catalog::Base
        end

        class Full < Search::Presenters::Record::Catalog::Full
          def url
            "#{S.base_url}/onlinejournals/record/#{id}"
          end

          def method_missing(method, *args, **kwargs, &block)
            super unless respond_to_missing?(method)
            S.logger.debug("#{method} not defined in Presenters::Record::Onlinejournals::Full")
            nil
          end

          def shelf_browse
            @shelf_browse ||= begin
              result = nil
            end
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
