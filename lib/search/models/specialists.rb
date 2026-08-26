class Search::Models::Specialists
  include Enumerable

  def self.for_catalog(uri)
    params = Search::Models::Results::Catalog.get_params(uri: uri).slice(:query, :filters, :boolean_filters)

    data = Search::Clients::CatalogAPI.new.get_catalog_specialists(**params)
    new(data)
  end

  def self.for_onlinejournals(uri)
    params = Search::Models::Results::Onlinejournals.get_params(uri: uri).slice(:query, :filters, :boolean_filters)

    data = Search::Clients::CatalogAPI.new.get_onlinejournals_specialists(**params)
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
