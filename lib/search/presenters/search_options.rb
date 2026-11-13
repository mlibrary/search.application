module Search
  module Presenters
    class SearchOption
      def initialize(option)
        @option = option
      end

      def value
        @option["value"]
      end

      def id
        @option["id"] || value
      end

      def text
        @option["text"]
      end

      def group
        @option["group"]
      end

      def tip
        @option["tip"]
      end

      def tip_label
        group.capitalize + " Tip:"
      end
    end

    class BaseSearchOptions
      BOOLEANS = ["AND", "OR", "NOT"]
      SEARCH_OPTIONS = Search::YamlErb.load_file(File.join(S.config_path, "search_options.yaml.erb")).map do |data|
        SearchOption.new(data)
      end

      def initialize(slug)
        @datastore = Search::Datastores.find(slug)
      end

      def datastore
        @datastore.slug
      end

      def options
        flat_list.chunk_while do |elt_before, elt_after|
          elt_before.group == elt_after.group
        end.to_a.map do |group|
          OpenStruct.new(
            optgroup: group.first.group,
            options: group
          )
        end
      end

      def flat_list
        # filtered options
        @datastore.search_options.map do |id|
          SEARCH_OPTIONS.find { |x| x.id == id }
        end
      end

      def default_option
        # get first option
        flat_list.first
      end

      def no_optgroups?
        options.count == 1
      end

      def optgroups?
        options.count > 1
      end

      def booleans
        BOOLEANS
      end
    end

    class SearchOptions
      ALL_BASE_SEARCH_OPTIONS = Search::Datastores.map do |datastore|
        BaseSearchOptions.new(datastore.slug)
      end

      include Enumerable
      extend Forwardable

      def_delegators :@base_search_options, :flat_list, :default_option

      attr_reader :base_search_options

      def initialize(datastore_slug:, uri:)
        @uri = uri
        @datastore_slug = datastore_slug
        @base_search_options = ALL_BASE_SEARCH_OPTIONS.find { |x| x.datastore == @datastore_slug }
      end

      def options
        if no_optgroups?
          base_search_options.options.first.options
        else
          base_search_options.options
        end
      end

      def each(&block)
        options.each do |group|
          block.call(group)
        end
      end

      def no_optgroups?
        search_only? || base_search_options.no_optgroups?
      end

      def show_optgroups?
        # check if more than one group
        base_search_options.optgroups? && !search_only?
      end

      def selected_attribute(value)
        (value == selected_option_value) ? "selected" : ""
      end

      def selected_option_value
        my_option = default_option

        query_string = params["query"]

        return my_option.value if base_search_options.booleans.any? { |x| query_string&.match?(x) }

        option_value_from_query = query_string&.split(":(")&.first

        if option_value_from_query
          found_option = flat_list.find { |option| option.value == option_value_from_query }
          my_option = found_option if found_option
        end
        my_option.value
      end

      def search_only?
        split_path = @uri.path.split("/")
        split_path.reject!(&:empty?)
        split_path.first == "advanced"
      end

      def params
        if !@uri.query.nil?
          URI.decode_www_form(@uri.query)&.to_h || {}
        else
          {}
        end
      end

      def booleans
        base_search_options.booleans
      end
    end
  end
end
