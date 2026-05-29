module Search
  module Clients
    class CatalogAPI
      attr_reader :conn

      def initialize
        @conn = Faraday.new(
          url: S.catalog_api_url, request: {params_encoder: Faraday::FlatParamsEncoder}
        ) do |f|
          f.request :json
          f.response :raise_error
          f.response :json
        end
      end

      def get_catalog_record(id)
        @conn.get("catalog/records/#{id}").body
      end

      def get_catalog_results(limit: 10, offset: 0, query: "*", filters: [], ht_search_only: false, sort: "")
        @conn.get("catalog/search", offset: offset, limit: limit, query: query, ht_search_only: ht_search_only, filters: filters, sort: sort).body
      end

      def get_catalog_specialists(query: "*", filters: [], ht_search_only: false, sort: "")
        @conn.get("catalog/specialists", query: query, ht_search_only: ht_search_only, filters: filters, sort: sort).body
      end
    end
  end
end
