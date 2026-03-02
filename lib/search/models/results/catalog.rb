class Search::Models::Results::Catalog
  def initialize(data)
    @data = data
  end

  def records
    @data["records"].map { |x| Search::Models::Record::Catalog.new(x) }
  end

  def pagination
    @pagination ||= Pagination.new(limit: limit, total: total, offset: offset)
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
