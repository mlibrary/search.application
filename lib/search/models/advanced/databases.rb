class Search::Models::Advanced::Databases < Search::Models::Advanced
  def self.for(uri)
    new(uri)
  end

  def initialize(uri)
    @uri = uri
  end
end
