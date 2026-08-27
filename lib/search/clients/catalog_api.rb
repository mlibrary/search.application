module Search
  module Clients
    class CatalogAPI
      attr_reader :conn

      BOOLEAN_FILTER_MAP = {
        catalog: {
          name: {
            "search_only" => :ht_search_only
          }
        },
        articles: {
          name: {
            "um_library_materials_only" => :include_citation_only,
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

      def get_catalog_results(limit: 10, offset: 0, query: "*", filters: [], sort: "", boolean_filters: [])
        bp = boolean_params(boolean_filters, kind: :catalog)
        @conn.get("catalog/search", offset: offset, limit: limit, query: query, filters: filters, sort: sort, **bp).body
      end

      def get_catalog_specialists(query: "*", filters: [], boolean_filters: [])
        bp = boolean_params(boolean_filters, kind: :catalog)
        @conn.get("catalog/specialists", query: query, filters: filters, **bp).body
      end

      def get_onlinejournals_record(id)
        @conn.get("onlinejournals/records/#{id}").body
      end

      def get_onlinejournals_results(limit: 10, offset: 0, query: "*", filters: [], sort: "")
        params = {offset: offset, limit: limit, query: query, sort: sort}
        params[:filters] = filters unless filters.empty?
        @conn.get("onlinejournals/search", **params).body
      end

      def get_onlinejournals_browse_academic_discipline(academic_discipline:, limit: 10, offset: 0)
        params = {offset: offset, limit: limit}
        url = Addressable::URI.encode_component("onlinejournals/browse_academic_discipline/#{academic_discipline}")
        @conn.get(url, **params).body
      end

      def get_onlinejournals_specialists(limit: 10, offset: 0, query: "*", filters: [])
        params = {offset: offset, limit: limit, query: query}
        params[:filters] = filters unless filters.empty?
        @conn.get("onlinejournals/specialists", **params).body
      end

      def get_onlinejournals_academic_disciplines
        @conn.get("onlinejournals/academic_disciplines").body
      end

      def get_articles_record(id)
        @conn.get("articles/records/#{id}").body
      end

      def get_articles_results(limit: 10, offset: 0, sort: "", query: "*", filters: [], boolean_filters: [])
        params = {offset: offset, limit: limit, sort: sort, query: query}
        params[:filters] = filters unless filters.empty?
        bp = boolean_params(boolean_filters, kind: :articles)
        params.merge!(bp)
        @conn.get("articles/search", **params).body
      end

      def boolean_params(filters, kind: :catalog)
        result = {}
        filters.each do |filter|
          key, value = filter.split(":")
          value = value == "true"
          param = BOOLEAN_FILTER_MAP.dig(kind, :name, key)
          if param
            if (BOOLEAN_FILTER_MAP.dig(kind, :toggle_value) || []).include?(param)
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
