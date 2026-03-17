class Search::Models::Results::Catalog
  def self.for(uri)
    current_page = (uri.query_hash["page"] || 1).to_i
    limit = (uri.query_hash["limit"] || 10).to_i
    offset = ((current_page - 1) * limit)
    query = uri.query_hash["query"] || ""
    data = Search::Clients::CatalogAPI.new.get_results(offset: offset, limit: limit, query: query)
    new(data: data, originating_uri: uri)
  end

  attr_reader :originating_uri

  def initialize(data:, originating_uri:)
    @data = data
    @originating_uri = originating_uri
  end

  def records
    @data["records"].map { |x| Search::Models::Record::Catalog.new(x) }
  end

  def pagination
    @pagination ||= Pagination.new(limit: limit, total: total.to_i, offset: offset.to_i)
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

  def filters
    @data["filters"].map { |x| Filter.new(x) }
  end
end

class Search::Models::Results::Catalog::Pagination
  attr_reader :total, :limit, :offset
  def initialize(total:, limit:, offset:)
    @total = total
    @limit = limit
    @offset = offset
  end

  def first_index
    offset + 1
  end

  def last_index
    [(offset + limit), total].min
  end

  def current_page
    (offset / limit) + 1
  end
end

class Search::Models::Results::Catalog::Filter
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
