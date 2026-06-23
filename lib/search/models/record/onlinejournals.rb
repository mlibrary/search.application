class Search::Models::Record::Onlinejournals < Search::Models::Record::Catalog
  def self.for(id)
    # TBChanged
    data = nil
    Yabeda.catalog_api_full_record_duration.measure do
      # get data from the api with the client
      data = Search::Clients::CatalogAPI.new.get_onlinejournals_record(id)
    end
    new(data)
  end
end
