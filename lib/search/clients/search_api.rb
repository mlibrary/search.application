module Search
  module Clients
    class SearchAPI
      attr_reader :conn

      BOOLEAN_FILTER_MAP = {
        catalog: {
          name: {
            "search_only" => :ht_search_only
          }
        },
        articles: {
          name: {
            "holdings_only" => :include_citation_only,
            "is_open_access" => :open_access,
            "available_only" => :online,
            "exclude_newspapers" => :exclude_newspapers,
            "is_scholarly" => :peer_reviewed
          },
          toggle_value: [:include_citation_only]
        }
      }

      def initialize
        @conn = Faraday.new(
          url: S.search_api_url, request: {params_encoder: Faraday::FlatParamsEncoder}
        ) do |f|
          f.request :json
          f.response :raise_error
          f.response :json
          f.adapter :httpx
        end
      end

      def get_record(datastore:, id:, params: {})
        @conn.get("#{datastore}/records/#{id}", **params).body
      end

      def get_results(datastore:, limit: 10, offset: 0, query: "*", filters: [], sort: "", boolean_filters: [])
        params = {offset: offset, limit: limit, query: query, sort: sort}
        my_filters = filters_params(filters, datastore: datastore.to_sym)
        params[:filters] = my_filters unless my_filters.empty?
        bp = boolean_params(boolean_filters, datastore: datastore.to_sym)
        params.merge!(bp)
        @conn.get("#{datastore}/search", **params).body
      end

      def get_specialists(datastore: :catalog, query: "*", filters: [], boolean_filters: [])
        params = {query: query}
        params[:filters] = filters unless filters.empty?
        bp = boolean_params(boolean_filters, datastore: datastore.to_sym)
        params.merge!(bp)
        @conn.get("#{datastore}/specialists", **params).body
      end

      def get_academic_disciplines(datastore:)
        @conn.get("#{datastore}/academic_disciplines").body
      end

      def get_browse_academic_discipline(datastore:, academic_discipline:, limit: 10, offset: 0)
        params = {offset: offset, limit: limit}
        url = Addressable::URI.encode_component("#{datastore}/browse_academic_discipline/#{academic_discipline}")
        @conn.get(url, **params).body
      end

      def filters_params(filters, datastore:)
        if datastore == :articles
          return filters.map do |filter|
            kind, value = filter.split(":")[0, 2]

            if kind == "date"
              years = value.split("-")[0, 2]
              "date:#{years.join(",")}"
            else
              filter
            end
          end
        end
        filters
      end

      def boolean_params(filters, datastore: :catalog)
        result = {}
        filters.each do |filter|
          key, value = filter.split(":")
          value = value == "true"
          param = BOOLEAN_FILTER_MAP.dig(datastore, :name, key)
          if param
            if (BOOLEAN_FILTER_MAP.dig(datastore, :toggle_value) || []).include?(param)
              value = value ? false : true
            end
            result[param] = value if value
          end
        end
        result
      end
    end
  end
end
