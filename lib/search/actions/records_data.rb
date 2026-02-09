module Search
  module Actions
    class RecordsData
      def initialize(data)
        @data = data
      end

      def text_urls
        @data.keys.map do |datastore|
          @data[datastore].map do |id|
            File.join(S.base_url, datastore, "record", id)
          end
        end.flatten
      end
    end
  end
end
