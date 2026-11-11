class Search::Models::Results::Onlinejournals < Search::Models::Results::Base
  def self.for(uri, limit: nil, offset: nil)
    params = get_params(uri: uri, limit: limit, offset: offset)

    api_client = Search::Clients::SearchAPI.new
    data = if params[:query] == "" && params[:sort] == "title_asc" && params[:filters].count == 1 && params[:filters][0].split(":")[0] == "academic_discipline"
      ad = params[:filters][0].split(":")[1]
      api_client.get_onlinejournals_browse_academic_discipline(limit: params[:limit], offset: params[:offset], academic_discipline: ad)
    else
      api_client.get_onlinejournals_results(**params)
    end
    new(data: data, originating_uri: uri)
  end
end
