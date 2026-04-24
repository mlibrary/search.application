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

      def get_record(id)
        @conn.get("records/#{id}").body
      end

      def get_results(limit: 10, offset: 0, query: "*", filters: [], ht_search_only: false)
        @conn.get("search", offset: offset, limit: limit, query: query, ht_search_only: ht_search_only, filters: filters).body
      end
    end
  end
end
