class Search::Presenters::Record::Catalog::Holdings
  #
  # <Description>
  #
  # @param [Search::Models::Record::Catalog] data is the catalog record model
  S #
  def initialize(data)
    @data = data
  end

  def list
  end

  def online
  end

  def physical
  end

  class HathiTrust
    def initialize(data)
      @items = data.hathi_trust
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
