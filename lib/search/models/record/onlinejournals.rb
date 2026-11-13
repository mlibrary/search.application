class Search::Models::Record::Onlinejournals < Search::Models::Record::Catalog
  def self.get_params(uri)
    {}
  end

  def recommended?
    !!@data["recommended_resource"]
  end
end
