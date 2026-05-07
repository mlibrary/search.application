class Search::Models::Advanced::Articles < Search::Models::Advanced
  def self.for(uri)
    new(uri)
  end

  def initialize(uri)
    @uri = uri
  end
end
