class Search::Models::Results::Onlinejournals < Search::Models::Results::Catalog
  def self.get_params(uri:, limit: nil, offset: nil)
    get_base_params(uri: uri, limit: limit, offset: offset)
  end

  def self.for(uri, limit: nil, offset: nil)
    params = get_params(uri: uri, limit: limit, offset: offset)

    api_client = Search::Clients::CatalogAPI.new
    data = if params[:query] == "" && params[:sort] == "title_asc" && params[:filters].count == 1 && params[:filters][0].split(":")[0] == "academic_discipline"
      ad = params[:filters][0].split(":")[1]
      api_client.get_onlinejournals_browse_academic_discipline(limit: params[:limit], offset: params[:offset], academic_discipline: ad)
    else
      api_client.get_onlinejournals_results(**params)
    end
    new(data: data, originating_uri: uri)
  end

  def records
    @records ||= @data["records"].each_with_index.map { |x, index| Search::Models::Record::Onlinejournals.new(x, position: position(index)) }
  end
end
