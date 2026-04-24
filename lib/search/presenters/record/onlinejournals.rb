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
        end

        class Brief < Search::Presenters::Record::Catalog::Brief
        end

        class Field < Search::Presenters::Record::Catalog::Field
        end
      end
    end
  end
end
