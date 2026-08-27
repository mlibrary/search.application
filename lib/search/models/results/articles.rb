class Search::Models::Results::Articles < Search::Models::Results::Catalog
  def self.get_params(uri:, limit: nil, offset: nil)
    get_base_params(uri: uri, limit: limit, offset: offset)
  end

  def self.for(uri, limit: nil, offset: nil)
    params = get_base_params(uri: uri, limit: limit, offset: offset)
    uri.query_hash # duplicate values can be arrays
    data = Search::Clients::CatalogAPI.new.get_articles_results(**params)
    new(data: data, originating_uri: uri)
  end

  def records
    @records ||= @data["records"].each_with_index.map { |x, index| Search::Models::Record::Articles.new(x, position: position(index)) }
  end
end
