class Search::Models::Results::Guidesandmore < Search::Models::Results::Catalog
  def self.get_params(uri:, limit: nil, offset: nil)
    get_base_params(uri: uri, limit: limit, offset: offset)
  end

  def self.for(uri, limit: nil, offset: nil)
    params = get_params(uri: uri, limit: limit, offset: offset)

    data = Search::Clients::SearchAPI.new.get_guidesandmore_results(**params)
    new(data: data, originating_uri: uri)
  end

  def records
    @records ||= @data["records"].each_with_index.map { |x, index| Search::Models::Record::Guidesandmore.new(x, position: position(index), originating_uri: @originating_uri) }
  end
end
