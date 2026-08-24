class Search::Models::Results::Onlinejournals < Search::Models::Results::Catalog
  def self.get_filters(params)
    params.filter_map do |element|
      if element[0].match?(/^filter\./)
        field = element[0].split(".")[1]
        if element[1].is_a? String
          "#{field}:#{element[1]}"
        else
          element[1].map { |value| "#{field}:#{value}" }
        end
      end
    end.flatten
  end

  def self.for(uri, limit: nil, offset: nil)
    qh = uri.query_hash # duplicate values can be arrays
    query_values = uri.query_values # flattens duplicate values

    current_page = (query_values["page"] || 1).to_i

    limit ||= (query_values["limit"] || 10).to_i

    params = {
      offset: offset || ((current_page - 1) * limit),
      limit: limit,
      query: query_values["query"] || "",
      filters: get_filters(qh),
      sort: query_values["sort"] || "relevance"
    }

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
