class Search::Presenters::Record::Catalog::Holdings
  #
  # <Description>
  #
  # @param [Search::Models::Record::Catalog] data is the catalog record model
  #
  def initialize(data)
    @data = data
    @holdings = @data.holdings
  end

  def list
    [
      HathiTrust.new(@holdings.hathi_trust.items),
      Online.new(@holdings),
      * physical
    ].reject { |x| x.empty? }
  end

  def physical
    @holdings.physical.list.map do |holding|
      Physical.new(holding: holding, bib: @data.bib)
    end
  end

  class HathiTrust
    #
    # <Description>
    #
    # @param items [Array<Search::Models::Record::Catalog::Holdings::HathiTrust::Item>] the HathiTrust items
    #
    def initialize(items)
      @items = items
    end

    def empty?
      @items.empty?
    end

    def heading
      "HathiTrust Digital Library"
    end

    def icon
      "devices"
    end

    def partial
      "electronic_holding"
    end

    def table_headings
      result = ["Link"]
      result.push("Description") if has_description?
      result.push("Source")
      result.map { |x| TableHeading.new(x) }
    end

    def rows
      items.map do |item|
        result = [item.link]
        result.push(item.description) if has_description?
        result.push(item.source)
      end
    end

    def items
      @items.map do |item|
        ElectronicItem.new(url: item.url, availability_text: item.status,
          description: item.description, source: item.source)
      end
    end

    def has_description?
      items.any? { |item| item.description.text.present? }
    end
  end

  class Online
    def initialize(holdings)
      @holdings = holdings
    end

    def empty?
      items.empty?
    end

    def heading
      "Online Resources"
    end

    def icon
      "devices"
    end

    def partial
      "electronic_holding"
    end

    def table_headings
      result = ["Link"]
      result.push("Description") if has_description?
      result.push("Source")
      result.map { |x| TableHeading.new(x) }
    end

    def rows
      items.map do |item|
        result = [item.link]
        result.push(item.description) if has_description?
        result.push(item.source)
      end
    end

    def has_description?
      items.any? { |item| item.description.text.present? }
    end

    def items
      @items ||= AlmaDigital.new(@holdings.alma_digital.items).items
        .concat(Electronic.new(@holdings.electronic.items).items)
    end
  end

  class AlmaDigital
    def initialize(items)
      @items = items
    end

    def items
      @items.map do |item|
        ElectronicItem.new(
          url: item.url, availability_text: "Available online",
          description: item.label, source: item.public_note
        )
      end
    end
  end

  class Electronic
    def initialize(items)
      @items = items
    end

    def items
      @items.map do |item|
        ElectronicItem.new(
          url: item.url, availability_text: availability_text(item),
          description: description_text(item), source: item.note
        )
      end
    end

    def availability_text(item)
      if item.available?
        "Available online"
      else
        "Coming Soon"
      end
    end

    def description_text(item)
      if item.available?
        item.description
      else
        ["Link will update when access is available.", item.description || ""].join(" ").strip
      end
    end
  end

  class ElectronicItem
    def initialize(url:, availability_text:, description:, source:)
      @url = url
      @availability_text = availability_text
      @description = description
      @source = source
    end

    def link
      ItemCell::LinkTo.new(text: @availability_text, url: @url)
    end

    def description
      ItemCell::PlainText.new(@description)
    end

    def source
      ItemCell::PlainText.new(@source)
    end

    def to_a
      [link, description, source]
    end
  end

  class TableHeading
    attr_reader :text
    def initialize(text)
      @text = text
    end

    def css_class
      "holding__table--heading-" + text.downcase.tr(" ", "-")
    end

    def to_s
      text
    end
  end

  class ItemCell
    def text
      raise NotImplementedError
    end

    def partial
      raise NotImplementedError
    end

    def to_s
      text
    end

    class PlainText < ItemCell
      attr_reader :text
      def initialize(text)
        @text = text
      end

      def partial
        "plain_text"
      end
    end

    class LinkTo < ItemCell
      attr_reader :text, :url
      def initialize(text:, url:)
        @text = text
        @url = url
      end

      def partial
        "link_to"
      end
    end
  end
end

require_relative "physical_holdings"
