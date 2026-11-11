module Search::Models::Results
  class Base
    def self.datastore
      name.split("::").last.downcase
    end

    def self.get_params(uri:, limit: nil, offset: nil)
      get_base_params(uri: uri, limit: limit, offset: offset)
    end

    def self.get_base_params(uri:, limit: nil, offset: nil)
      qh = uri.query_hash # duplicate values can be arrays
      query_values = uri.query_values || {} # flattens duplicate values

      filters, boolean_filters = get_filters(qh)

      result = {
        offset: offset || Search::Models::Results::Pagination.offset_for(uri),
        limit: limit || Search::Models::Results::Pagination.limit_for(uri),
        query: query_values["query"] || "",
        filters: filters,
        sort: query_values["sort"] || "relevance"
      }
      result[:boolean_filters] = boolean_filters unless boolean_filters.empty?
      result
    end

    def self.get_filters(params)
      filters = []
      boolean_filters = []
      all = params.filter_map do |element|
        if element[0].match?(/^filter\./)
          field = element[0].split(".")[1]
          if element[1].is_a? String
            "#{field}:#{element[1]}"
          else
            element[1].map { |value| "#{field}:#{value}" }
          end
        end
      end.flatten.uniq
      all.each do |filter|
        if ["true", "false"].include?(filter.split(":")[1].downcase)
          boolean_filters.push(filter.downcase)
        else
          filters.push(filter)
        end
      end
      [filters, boolean_filters.uniq]
    end

    def self.browse_results?(params)
      [:onlinejournals, :databases].include?(datastore.to_sym) &&
        params[:query] == "" &&
        params[:sort] == "title_asc" &&
        params[:filters].count == 1 &&
        params[:filters][0].split(":")[0] == "academic_discipline"
    end

    def self.browse_params(params)
      {
        limit: params[:limit],
        offset: params[:offset],
        academic_discipline: params[:filters][0].split(":")[1]
      }
    end

    def self.for(uri, limit: nil, offset: nil)
      params = get_params(uri: uri, limit: limit, offset: offset)

      api_client = Search::Clients::SearchAPI.new
      data = if browse_results?(params)
        params[:filters][0].split(":")[1]
        api_client.get_browse_academic_discipline(datastore: datastore, **browse_params(params))
      else
        api_client.get_results(datastore: datastore, **params)
      end
      new(data: data, originating_uri: uri)
    end

    attr_reader :originating_uri
    def initialize(data:, originating_uri:)
      @data = data
      @originating_uri = originating_uri
    end

    def datastore
      self.class.datastore
    end

    def limit
      @data["limit"]
    end

    def total
      @data["total"]
    end

    def offset
      @data["offset"]
    end

    def pagination
      @pagination ||= Search::Models::Results::Pagination.new(limit: limit, total: total.to_i, offset: offset.to_i)
    end

    def filters
      @data["filters"].filter_map { |x| Search::Models::Results::Filter.new(x) if x["values"].present? }
    end

    def records
      @records ||= @data["records"].each_with_index.map do |x, index|
        "Search::Models::Record::#{datastore.capitalize}".constantize.new(x, position: position(index), originating_uri: @originating_uri)
      end
    end

    private

    def position(index)
      offset + index + 1
    end
  end

  class Filter
    def initialize(data)
      @data = data
    end

    def field
      @data["field"]
    end

    def values
      @data["values"].map { |x| Value.new(x) }
    end

    class Value
      def initialize(data)
        @data = data
      end

      def value
        @data["text"]
      end

      def count
        @data["count"]
      end
    end
  end
end

require "search/models/results/pagination"
require "search/models/results/catalog"
class Search::Models::Results::Onlinejournals < Search::Models::Results::Base
end

class Search::Models::Results::Articles < Search::Models::Results::Base
end

class Search::Models::Results::Databases < Search::Models::Results::Base
end

class Search::Models::Results::Guidesandmore < Search::Models::Results::Base
end
