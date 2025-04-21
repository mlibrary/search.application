class Search::Presenters::Record::Catalog::Holdings
  def self.electronic_item(url:, availability_text:, description:, source:)
    OpenStruct.new(
      link: OpenStruct.new(partial: "link", text: availability_text, url: url),
      description: OpenStruct.new(partial: "plain_text", text: description),
      source: OpenStruct.new(partial: "plain_text", text: source)
    )
  end

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
      HathiTrust.new(@holdings.hathi_trust.items)
    ].reject { |x| x.empty? }
  end

  def physical
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

    def partial
      "electronic_holding"
    end

    def items
      @items.map do |item|
        Search::Presenters::Record::Catalog::Holdings.electronic_item(url: item.url, availability_text: item.status,
          description: item.description, source: item.source)
      end
    end
  end

  class Online
    # take in holdings?
    def initialize(holdings)
      @holdings = holdings
    end

    def empty?
      items.empty?
    end

    def heading
      "Online Resources"
    end

    def partial
      "electronic_holding"
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
        Search::Presenters::Record::Catalog::Holdings.electronic_item(
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
        Search::Presenters::Record::Catalog::Holdings.electronic_item(
          url: item.url, availability_text: availability_text(item),
          description: description_text(item), source: item.note
        )
      end
    end

    def availability_text(item)
      if item.status.downcase == "available"
        "Available online"
      else
        "Coming Soon"
      end
    end

    def description_text(item)
      if item.status.downcase == "available"
        item.description
      else
        ["Link will update when access is available.", @item.description || ""].join(" ").strip
      end
    end
  end
end
