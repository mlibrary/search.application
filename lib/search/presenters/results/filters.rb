module Search::Presenters
  class Results
    class Filters
    end

    class BooleanFilter
      def self.for(uri:, uid:, label:, default:)
        klass = (default == "true") ? DefaultTrue : DefaultFalse
        klass.new(uri: uri, uid: uid, label: label)
      end
      attr_reader :uid, :label
      def initialize(uri:, uid:, label:)
        @uri = uri
        @uid = uid
        @label = label
      end

      def active?
        raise NotImplementedError
      end

      def url
        result = if active?
          inactive_url
        else # curently is off, so link to turning it on
          active_url
        end
        result.display_uri.to_s
      end

      private

      def opposite_value
        raise NotImplementedError
      end

      # currently active?

      # url to check the checkbox
      def active_url
        raise NotImplementedError
      end

      # url to uncheck the checkbox
      def inactive_url
        raise NotImplementedError
      end

      def query_key
        "filter.#{uid}"
      end

      def original_value
        value = @uri.query_hash[query_key]
        if value.is_a?(String) || value.nil?
          value
        elsif value&.any? { |x| x == opposite_value } # value is an array"
          opposite_value
        end
      end

      def filter_off
        result = @uri.dup
        query_values = result.query_values(Array) || []
        query_values.reject! { |x| x[0] == "filter.#{uid}" }
        result.query_values = query_values
        result
      end

      def filter_on
        result = filter_off.dup
        query_values = result.query_values(Array) || []
        query_values.append(["filter.#{uid}", opposite_value])
        result.query_values = query_values
        result
      end
    end

    class BooleanFilter::DefaultTrue < BooleanFilter
      def active?
        original_value.nil?
      end

      private

      def opposite_value
        "false"
      end

      # url to check the checkbox
      def active_url
        filter_off
      end

      # url to uncheck the checkbox
      def inactive_url
        filter_on
      end
    end

    class BooleanFilter::DefaultFalse < BooleanFilter
      def active?
        original_value == "true"
      end

      private

      def opposite_value
        "true"
      end

      # url to check the checkbox
      def active_url
        filter_on
      end

      # url to uncheck the checkbox
      def inactive_url
        filter_off
      end
    end

    class Filter
      attr_reader :uid, :value, :label, :count

      def self.boolean_for(uri:, uid:, value:, count:, label: nil)
        klass = active?(uri: uri, uid: uid, value: value) ? Active : Inactive
        klass.new(uri: uri, uid: uid, value: value, label: label, count: count)
      end

      def self.for(uri:, uid:, value:, count:)
        klass = active?(uri: uri, uid: uid, value: value) ? Active : Inactive
        klass.new(uri: uri, uid: uid, value: value, count: count)
      end

      def self.active?(uri:, uid:, value:)
        result = Addressable::URI.parse(uri)
        query_values = result.query_values(Array) || []
        query_param = ["filter.#{uid}", value]
        query_values.include?(query_param)
      end

      def initialize(uri:, uid:, value:, count:, label: nil)
        @uri = uri
        @uid = uid
        @value = value
        @label = label
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

      private

      def add_param(uri:, uid:, value:, prefix: nil)
        result = Addressable::URI.parse(uri)
        query_values = result.query_values(Array) || []
        query_values.push([make_key(prefix, uid), value])
        result.query_values = query_values
        result.display_uri.to_s
      end

      def remove_param(uri:, uid:, value:, prefix: nil)
        result = Addressable::URI.parse(uri)
        query_values = result.query_values(Array) || []
        to_be_removed = [make_key(prefix, uid), value]
        query_values.reject! { |x| x == to_be_removed }
        result.query_values = query_values
        result.display_uri.to_s
      end

      def make_key(prefix, uid)
        if prefix
          "#{prefix}.#{uid}"
        else
          uid
        end
      end
    end

    class Filter::Inactive < Filter
      def to_s
        value
      end

      def url
        add_param(uri: @uri, uid: uid, value: value, prefix: "filter")
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
        remove_param(uri: @uri, uid: uid, value: value, prefix: "filter")
      end

      def active?
        true
      end
    end
  end
end
