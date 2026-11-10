class Search::Models::Results::Articles < Search::Models::Results::Base
  def self.for(uri, limit: nil, offset: nil)
    params = get_base_params(uri: uri, limit: limit, offset: offset)
    uri.query_hash # duplicate values can be arrays
    data = Search::Clients::SearchAPI.new.get_articles_results(**params)
    new(data: data, originating_uri: uri)
  end
end
