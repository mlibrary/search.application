module Search
  module Clients
    class CatalogAPI
      attr_reader :conn

      def initialize
        @conn = Faraday.new(
          url: S.catalog_api_url
        ) do |f|
          f.request :json
          f.response :raise_error
          f.response :json
        end
      end

      def get_record(id)
        @conn.get("records/#{id}").body
      end
    end
  end
end
