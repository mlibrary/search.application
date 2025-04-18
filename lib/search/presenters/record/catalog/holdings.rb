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
        OpenStruct.new(
          link: OpenStruct.new(partial: "link", text: item.status, url: item.url),
          description: OpenStruct.new(partial: "plain_text", text: item.description),
          source: OpenStruct.new(partial: "plain_text", text: item.source)
        )
      end
    end
  end

  class Online
    def initialize(data)
      @data = data
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
      @items ||= AlmaDigital.new(data.holdings.alma_digital).items
      + Electronic.new(data.holdings.electronic).items
    end
  end

  class AlmaDigital
    def initialize(items)
      @items = items
    end

    def items
      @items.map do |item|
        OpenStruct.new(
          link: OpenStruct.new(partial: "link", text: "Available online", url: item.url),
          description: OpenStruct.new(partial: "plain_text", text: item.label),
          source: OpenStruct.new(partial: "plain_text", text: item.source)
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
        OpenStruct.new(
          link: OpenStruct.new(partial: "link", text: availability_text(item), url: item.url),
          description: OpenStruct.new(partial: "plain_text", text: description_text(item)),
          source: OpenStruct.new(partial: "plain_text", text: item.source)
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
