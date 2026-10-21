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

  def self.plain_text_item(text)
    Item.new({"text" => text})
  end

  def self.link_to_item(text:, url:)
    BaseLinkToItem.new(text: text, url: url)
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

    def to_h
      result = {original: original.to_h}
      result[:transliterated] = transliterated.to_h if paired?
      result
    end
  end

  # to include this, the class needs to have @data with a "search" key and a @datastore
  module SearchUrl
    def url
      query_string = @data["search"].map do |x|
        "#{x["field"]}:\"#{x["value"]}\""
      end.join(" AND ")
      "#{S.base_url}/#{@datstore}?" + {query: query_string}.to_query
    end
  end

  # to include this, the class needs to have the methods browse_category and browse_query_string
  module BrowseUrl
    def browse_url
      "#{S.base_url}/catalog/browse/#{browse_category}?" + {query: browse_query_string}.to_query
    end
  end

  module BrowseHash
    def to_h
      {
        text: text,
        url: url,
        browse_url: browse_url,
        kind: kind
      }.compact
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

    def to_h
      {text: text}
    end
  end

  class BaseLinkToItem < Item
    attr_reader :url
    attr_reader :text

    def initialize(text:, url:)
      @text = text
      @url = url
    end

    def to_h
      {
        text: text,
        url: url
      }
    end
  end

  class LinkToItem < Item
    def initialize(data:, datastore:)
      @data = data
      @datstore = datastore
    end

    def to_h
      {
        text: text,
        url: url
      }
    end
  end

  class SearchLinkToItem < LinkToItem
    include SearchUrl
  end

  # Catalog
  class AuthorBrowseItem < SearchLinkToItem
    include BrowseUrl
    include BrowseHash

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
    include BrowseHash

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
    include BrowseHash

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

    # This is here so _map_field can work
    def text
      @data["list"].join(" > ")
    end

    def to_h
      disciplines.map do |d|
        d.to_h
      end
    end

    def disciplines
      @data["list"].map do |text|
        AcademicDisciplineElement.new(text)
      end
    end
  end

  class AcademicDisciplineElement < LinkToItem
    attr_reader :text
    def initialize(text)
      @text = text
    end

    def url
      "#{S.base_url}/catalog?" + {query: "academic_discipline:#{text}"}.to_query
    end
  end

  # Articles
  class ArticlesSubjectItem < LinkToItem
    def initialize(data)
      @data = data
    end

    def url
      "#{S.base_url}/articles?" + {query: "subject:\"#{text}\""}.to_query
    end
  end
end
