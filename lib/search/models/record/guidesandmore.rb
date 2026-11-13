class Search::Models::Record::Guidesandmore < Search::Models::Record::Base
  def url
    @data["url"]
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
