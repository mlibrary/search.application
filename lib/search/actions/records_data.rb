module Search
  module Actions
    class RecordsData
      def initialize(data)
        @data = data
      end

      def single?
        count = 0
        @data.keys.each do |datastore|
          @data[datastore].each do |_|
            count += 1
            return false if count > 1
          end
        end
        true
      end

      def first
        datastore = @data.keys.first
        OpenStruct.new(datastore: datastore, id: @data[datastore].first)
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
