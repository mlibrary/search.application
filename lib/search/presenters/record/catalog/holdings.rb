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
end
