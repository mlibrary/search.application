class Search::Models::Results::Articles < Search::Models::Results::Base
  def self.for(uri, limit: nil, offset: nil)
    params = get_params(uri: uri, limit: limit, offset: offset)
    data = Search::Clients::SearchAPI.new.get_articles_results(**params)
    new(data: data, originating_uri: uri)
  end
end
