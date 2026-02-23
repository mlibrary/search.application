module Search::Presenters
  class Results
    class Filters
    end

    class Filter
      attr_reader :uid, :value, :count

      def self.for(uri:, uid:, value:, count:)
        result = Addressable::URI.parse(uri)
        query_values = result.query_values(Array) || []
        query_param = ["filter.#{uid}", value]
        klass = if query_values.include?(query_param)
          Active
        else
          Inactive
        end
        klass.new(uri: uri, uid: uid, value: value, count: count)
      end

      def initialize(uri:, uid:, value:, count:)
        @uri = uri
        @uid = uid
        @value = value
        @count = count
      end

      def group_name
        uid.titleize.sub(/\sOf\s/, " of ")
      end

      def to_s
        raise NotImplementedError
      end

      def url
        raise NotImplementedError
      end

      def active?
        raise NotImplementedError
      end
    end

    class Filter::Inactive < Filter
      def to_s
        value
      end

      def url
        Search::Presenters.add_param(uri: @uri, uid: uid, value: value, prefix: "filter")
      end

      def active?
        false
      end
    end

    class Filter::Active < Filter
      def to_s
        "#{group_name}: #{value}"
      end

      def url
        Search::Presenters.remove_param(uri: @uri, uid: uid, value: value, prefix: "filter")
      end

      def active?
        true
      end
    end
  end
end
