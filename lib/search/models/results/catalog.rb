class Search::Models::Results::Catalog
  FIXED_RECORD_IDS = [
    990038939650106381,
    990006758990106381,
    99187579295006381,
    990040646010106381,
    11102699205,
    11100320512,
    11100323049,
    11010551022,
    11011665129,
    990008570110106381,
    990008570170106381,
    990008570210106381,
    990008570040106381,
    990008839630106381,
    99187591950506381,
    99187482531606381,
    99187422679306381,
    11100372386,
    99187272754306381,
    99188902815106381,
    990015014190106381,
    990043272160106381,
    990039822770106381,
    990024357620106381
  ]
  FIXED_FILTERS = [
    {
      "field" => "availability",
      "values" => [
        {"text" => "Available Online", "count" => 15762},
        {"text" => "Physical", "count" => 8421},
        {"text" => "HathiTrust", "count" => 3245}
      ]
    },
    {
      "field" => "format",
      "values" => [
        {"text" => "Book", "count" => 11826},
        {"text" => "Journal", "count" => 7398},
        {"text" => "Music", "count" => 1234},
        {"text" => "Video", "count" => 987},
        {"text" => "Map", "count" => 456},
        {"text" => "Manuscript", "count" => 321},
        {"text" => "Audio (music)", "count" => 321}
      ]
    },
    {
      "field" => "subject",
      "values" => [
        {"text" => "History", "count" => 6789},
        {"text" => "Science", "count" => 5678},
        {"text" => "Literature", "count" => 4567},
        {"text" => "Art", "count" => 3456},
        {"text" => "Technology", "count" => 2345}
      ]
    },
    {
      "field" => "date_of_publication",
      "values" => [
        {"text" => "2020-2024", "count" => 3456},
        {"text" => "2010-2019", "count" => 5678},
        {"text" => "2000-2009", "count" => 4567},
        {"text" => "1990-1999", "count" => 2345},
        {"text" => "1980-1989", "count" => 1234},
        {"text" => "1970-1979", "count" => 1234},
        {"text" => "1960-1969", "count" => 1234},
        {"text" => "Before 1960", "count" => 6789}
      ]
    },
    {
      "field" => "language",
      "values" => [
        {"text" => "English", "count" => 14567},
        {"text" => "Spanish", "count" => 2345},
        {"text" => "French", "count" => 1234},
        {"text" => "German", "count" => 987},
        {"text" => "Chinese", "count" => 876},
        {"text" => "Japanese", "count" => 765},
        {"text" => "Russian", "count" => 654}
      ]
    },
    {
      "field" => "author",
      "values" => [
        {"text" => "Smith, John", "count" => 123},
        {"text" => "Doe, Jane", "count" => 98},
        {"text" => "Brown, Bob", "count" => 76},
        {"text" => "Johnson, Alice", "count" => 54},
        {"text" => "Davis, Charlie", "count" => 32}
      ]
    },
    {
      "field" => "publisher",
      "values" => [
        {"text" => "Penguin Random House", "count" => 456},
        {"text" => "HarperCollins", "count" => 345},
        {"text" => "Simon & Schuster", "count" => 234},
        {"text" => "Macmillan Publishers", "count" => 123},
        {"text" => "Hachette Livre", "count" => 98}
      ]
    }
  ]

  def self.for(uri)
    current_page = (uri.query_hash["page"] || 1).to_i
    limit = (uri.query_hash["limit"] || 10).to_i
    offset = ((current_page - 1) * limit)
    records = FIXED_RECORD_IDS[offset, limit].map do |id|
      JSON.parse(File.read("#{S.project_root}/spec/fixtures/results/#{id}.json"))
    end
    {
      "records" => records,
      "filters" => FIXED_FILTERS,
      "limit" => limit,
      "offset" => offset,
      "total" => FIXED_RECORD_IDS.length
    }
    data = Search::Clients::CatalogAPI.new.get_results(offset: offset)
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
