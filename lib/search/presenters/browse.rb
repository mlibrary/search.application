module Search::Presenters
  class Browse
      attr_reader :datastore

      def initialize(datastore:)
        @datastore = datastore
      end


    def has_browse?
      ["databases", "onlinejournals"].include?(@datastore)
    end
  end
end
