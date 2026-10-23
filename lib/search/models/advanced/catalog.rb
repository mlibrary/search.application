class Search::Models::Advanced::Catalog < Search::Models::Advanced
  def self.for(uri)
    new(uri)
  end

  def initialize(uri)
    @uri = uri
  end
end
