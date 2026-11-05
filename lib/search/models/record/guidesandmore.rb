class Search::Models::Record::Guidesandmore
  attr_reader :position

  def self.for(id, uri = nil)
    data = nil
    Yabeda.search_api_full_record_duration.measure do
      # get data from the api with the client
      data = Search::Clients::SearchAPI.new.get_guidesandmore_record(id)
    end
    new(data)
  end

  def initialize(data, position: nil)
    @data = data
    @position = position
  end

  def bib
    Bib.new(@data)
  end

  def citation
    Search::Models::Record::Catalog::Citation.new(@data)
  end

  class Bib
    include Search::Models::Record::Metadata

    def initialize(data)
      @data = data
      @datastore = "guidesandmore"
    end

    def id
      @data["id"]
    end

    def title
      map_field("title") do |item|
        PlainLinkToItem.new(text: item["text"], url: @data["url"])
      end.first
    end

    [:description, :type, :author].each do |uid|
      define_method(uid) do
        map_text_field(uid)
      end
    end

    def published
      if @data["published"]
        [PlainItem.new(Date.parse(@data["published"]).strftime("%B %-d, %Y"))]
      end
    end
  end
end
