class Search::Models::Results::Catalog
  LIBRARY_MAP = {
    "All libraries" => "all",
    "U-M Ann Arbor Libraries" => "aa",
    "Flint Thompson Library" => "flint",
    "Bentley Historical Library" => "bentley",
    "William L. Clements Library" => "clements"

  }

  def self.get_params(uri:, limit: nil, offset: nil)
    result = get_base_params(uri: uri, limit: limit, offset: offset)
    qh = uri.query_hash # duplicate values can be arrays
    library = LIBRARY_MAP[qh["library"]] || "aa"
    result[:filters].push("library:#{library}")
    result
  end

  # the parameters are needed so that we can get previous and next records
  def self.for(uri, limit: nil, offset: nil)
    params = get_base_params(uri: uri, limit: limit, offset: offset)
    qh = uri.query_hash # duplicate values can be arrays
    library = LIBRARY_MAP[qh["library"]] || "aa"
    params[:filters].push("library:#{library}")

    data = Search::Clients::CatalogAPI.new.get_catalog_results(**params)
    new(data: data, originating_uri: uri)
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

  def self.get_base_params(uri:, limit: nil, offset: nil)
    qh = uri.query_hash # duplicate values can be arrays
    query_values = uri.query_values || {} # flattens duplicate values

    current_page = (query_values["page"] || 1).to_i
    limit ||= (query_values["limit"] || 10).to_i
    filters, boolean_filters = get_filters(qh)

    result = {
      offset: offset || ((current_page - 1) * limit),
      limit: limit,
      query: query_values["query"] || "",
      filters: filters,
      sort: query_values["sort"] || "relevance"
    }
    result[:boolean_filters] = boolean_filters unless boolean_filters.empty?
    result
  end

  attr_reader :originating_uri

  def initialize(data:, originating_uri:)
    @data = data
    @originating_uri = originating_uri
  end

  def records
    @records ||= @data["records"].each_with_index.map { |x, index| Search::Models::Record::Catalog.new(x, position: position(index)) }
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

  private

  def position(index)
    offset + index + 1
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
