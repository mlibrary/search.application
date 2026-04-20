class Search::Models::Results::Catalog
  LIBRARY_MAP = {
    "All libraries" => "all",
    "U-M Ann Arbor Libraries" => "aa",
    "Flint Thompson Library" => "flint",
    "Bentley Historical Library" => "bentley",
    "William L. Clements Library" => "clements"

  }
  def self.get_filters(params)
    result = params.filter_map do |element|
      if element[0].match?(/^filter\./)
        next if element[0] == "filter.search_only"
        field = element[0].split(".")[1]
        if element[1].is_a? String
          "#{field}:#{element[1]}"
        else
          element[1].map { |value| "#{field}:#{value}" }
        end
      end
    end.flatten
    library = LIBRARY_MAP[params["library"]] || "aa"
    result.push("library:#{library}")
    result
  end

  def self.ht_search_only(params)
    value = params["filter.search_only"]
    if value.is_a?(String) || value.nil?
      value == "true"
    elsif value&.any? { |x| x == "true" } # value is an array"
      true
    end
  end

  def self.for(uri)
    qh = uri.query_hash
    current_page = (qh["page"] || 1).to_i

    limit = (qh["limit"] || 10).to_i

    qh["query"] || ""
    get_filters(qh)

    params = {
      offset: ((current_page - 1) * limit),
      limit: limit,
      query: qh["query"] || "",
      filters: get_filters(qh)
    }

    params[:ht_search_only] = true if ht_search_only(qh)

    data = Search::Clients::CatalogAPI.new.get_results(**params)
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
    @data["filters"].filter_map { |x| Filter.new(x) if x["values"].present? }
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
