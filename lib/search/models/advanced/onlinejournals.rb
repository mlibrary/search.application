class Search::Models::Advanced::Onlinejournals < Search::Models::Advanced
  def self.for(uri)
    new(uri)
  end

  def initialize(uri)
    @uri = uri
  end
end
