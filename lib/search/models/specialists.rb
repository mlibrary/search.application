class Search::Models::Specialists
  include Enumerable

  def self.for_catalog(uri)
    query_values = uri.query_values
    params = {
      query: query_values["query"] || "",
      filters: Search::Models::Results::Catalog.get_filters(uri.query_hash),
      sort: query_values["sort"] || "relevance"
    }
    ht_search_only = Search::Models::Results::Catalog.ht_search_only(uri.query_hash)
    params[:ht_search_only] = true if ht_search_only

    data = Search::Clients::CatalogAPI.new.get_catalog_specialists(**params)
    new(data)
  end

  def initialize(data)
    @data = data
  end

  def specialists
    @specialists ||= @data["specialists"].map do |entry|
      OpenStruct.new(
        name: entry["name"],
        title: entry["title"],
        uniqname: entry["uniqname"],
        phone: entry["phone"],
        email: "#{entry["uniqname"]}@umich.edu",
        image_url: "images/specialists/#{entry["uniqname"]}.webp"
      )
    end
  end

  def each(&block)
    specialists.each(&block)
  end
end
