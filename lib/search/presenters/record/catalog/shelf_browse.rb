class Search::Presenters::Record::Catalog::ShelfBrowse
  def self.for(call_number:)
    if call_number.present?
      @conn = Faraday.new(
        url: "#{S.catalog_browse_url}/carousel",
        params: {query: call_number}
      ) do |f|
        f.request :json
        f.response :raise_error
        f.response :json
      end
      response = @conn.get
      if response.status == 200
        new(call_number: call_number, data: response.body)
      else
        S.logger.error(response.status + " Couldn't contact Catalog Browse.")
      end
    end
  end

  def initialize(call_number:, data:)
    @call_number = call_number
    @data = data
  end

  def items
    @data.map.with_index do |item, index|
      if @call_number == item["call_number"]
        ShelfBrowseItemCurrent.new(item, index)
      elsif index == @data.length - 1 || index == 0
        ShelfBrowseItemEnd.new(item)
      else
        ShelfBrowseItem.new(item, index)
      end
    end
  end

  def browse_url
    "#{S.catalog_browse_url}/callnumber?query=#{@call_number}"
  end

  include Enumerable

  def each(&block)
    items.each do |item|
      block.call(item)
    end
  end

  class ShelfBrowseItemBase
    attr_reader :item

    def initialize(item)
      @item = item
    end

    def attributes
      "class=\"shelf-browse__carousel--item\""
    end

    def url
      @item["url"]
    end

    def has_url?
      !url.nil?
    end

    def table_label
      "Catalog browse record information for #{@item["title"]}"
    end

    def caption
      nil
    end

    def has_caption?
      !caption.nil?
    end

    def call_number
      ShelfBrowseItemRow.for(
        header: "Call Number",
        uid: "call_number",
        value: @item["call_number"]
      )
    end
  end

  class ShelfBrowseItem < ShelfBrowseItemBase
    attr_reader :item, :index

    def initialize(item, index)
      @item = item
      @index = index
    end

    def book_cover
      ShelfBrowseItemRow.for(
        uid: "book_cover",
        header: "Book Cover",
        value: "<img src=\"#{@item["book_cover_url"]}\" onerror=\"this.src='/images/placeholders/placeholder-#{@index % 15}.svg'\" alt=\"Book cover for #{@item["title"]}\">"
      )
    end

    [
      {uid: :title, header: "Title"},
      {uid: :author, header: "Author"},
      {uid: :date, header: "Date"}
    ].each do |f|
      define_method(f[:uid]) do
        ShelfBrowseItemRow.for(
          header: f[:header],
          uid: f[:uid],
          value: @item[f[:uid].to_s]
        )
      end
    end

    def rows
      [
        :book_cover,
        :title,
        :author,
        :date,
        :call_number
      ].map { |row| public_send(row) }.compact
    end
  end

  class ShelfBrowseItemCurrent < ShelfBrowseItem
    attr_reader :item, :index

    def initialize(item, index)
      @item = item
      @index = index
    end

    def attributes
      "class=\"shelf-browse__carousel--item highlighted-record current-record\" data-page=\"0\""
    end

    def caption
      "Current Record"
    end

    def url
      nil
    end
  end

  class ShelfBrowseItemEnd < ShelfBrowseItemBase
    attr_reader :item

    def initialize(item)
      @item = item
    end

    def attributes
      "class=\"shelf-browse__carousel--item highlighted-record\""
    end

    def caption
      "<span class=\"material-symbols-rounded\" aria-hidden=\"true\">list</span>"
    end

    def navigate
      ShelfBrowseItemRow.for(
        header: "Navigate",
        uid: "navigate",
        value: "Continue browsing in call number list"
      )
    end

    def rows
      [:navigate, :call_number].map { |row| public_send(row) }.compact
    end

    def url
      "#{S.catalog_browse_url}/callnumber?query=#{@item["call_number"]}"
    end
  end

  class ShelfBrowseItemRow
    def self.for(header:, value:, uid:)
      new(uid: uid, header: header, value: value) if !value.nil?
    end

    attr_reader :uid, :header, :value

    def initialize(header:, value:, uid:)
      @header = header
      @value = value
      @uid = uid
    end
  end
end
