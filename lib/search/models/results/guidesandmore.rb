class Search::Models::Results::Guidesandmore < Search::Models::Results::Base
  def self.for(uri, limit: nil, offset: nil)
    params = get_params(uri: uri, limit: limit, offset: offset)

    data = Search::Clients::SearchAPI.new.get_guidesandmore_results(**params)
    new(data: data, originating_uri: uri)
  end
end
