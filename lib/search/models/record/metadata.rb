module Search::Models::Record::Metadata
  def map_text_field(uid)
    map_field(uid) do |item|
      Item.new(item)
    end.uniq(&:text)
  end

  def map_paired_field(uid)
    map_field(uid) do |item|
      temp = {}
      item.to_a.each do |key, value|
        if value
          temp[key] = yield value
        end
      end
      PairedItem.for(temp)
    end
  end

  def map_field(uid)
    list = @data.dig(uid.to_s) || []
    list.map do |item|
      yield(item)
    end
  end

  private

  class PairedItem
    def self.for(item)
      new(item)
    end
    attr_reader :original
    def initialize(item)
      @transliterated = item["transliterated"]
      @original = item["original"]
    end

    def transliterated
      @transliterated unless original == @transliterated
    end

    def paired?
      transliterated.present?
    end
  end

  # to include this, the class needs to have @data with a "search" key
  module SearchUrl
    def url
      query_string = @data["search"].map do |x|
        "#{x["field"]}:\"#{x["value"]}\""
      end.join(" AND ")
      "#{S.base_url}/catalog?" + {query: query_string}.to_query
    end
  end

  # to include this, the class needs to have the methods browse_category and browse_query_string
  module BrowseUrl
    def browse_url
      "#{S.base_url}/catalog/browse/#{browse_category}?" + {query: browse_query_string}.to_query
    end
  end

  class Item
    def initialize(data)
      @data = data
    end

    def text
      @data["text"].strip
    end

    def to_s
      text
    end

    def ==(other)
      self.class == other.class && text == other.text
    end

    def paired?
      false
    end
  end

  class LinkToItem < Item
    include SearchUrl
  end

  class AuthorBrowseItem < Item
    include SearchUrl
    include BrowseUrl

    def kind
      "author"
    end

    private

    def browse_category
      "author"
    end

    def browse_query_string
      @data["browse"]
    end
  end

  class SubjectBrowseItem < Item
    include BrowseUrl

    def kind
      "subject"
    end

    def url
      "#{S.base_url}/catalog?" + {query: "subject:\"#{browse_query_string}\""}.to_query
    end

    private

    def browse_category
      "subject"
    end

    def browse_query_string
      text.split(" -- ").join(" ")
    end
  end

  class CallNumberBrowseItem < Item
    include BrowseUrl

    def kind
      "call_number"
    end

    def url
    end

    private

    def browse_category
      "callnumber"
    end

    def browse_query_string
      text
    end
  end

  class AcademicDisciplineItem
    def initialize(data)
      @data = data
    end

    def paired?
      false
    end

    # This is here _map_field can work
    def text
      @data["list"].join(" > ")
    end

    def disciplines
      @data["list"].map do |text|
        AcademicDisciplineElement.new(text)
      end
    end
  end

  class AcademicDisciplineElement < Item
    attr_reader :text
    def initialize(text)
      @text = text
    end

    def url
      "#{S.base_url}/catalog?" + {query: "academic_discipline:#{text}"}.to_query
    end
  end
end
