class Search::Presenters::Record::Onlinejournals::Holdings < Search::Presenters::Record::Catalog::Holdings
  def list
    [online].reject { |x| x.empty? }
  end

  def online
    @online ||= Online.new(@holdings)
  end

  class Online < Search::Presenters::Record::Catalog::Holdings::Online
    def items
      @items ||= Electronic.new(@holdings.electronic.items).items
    end

    def table_headings
      result = ["Action"]
      result.push("Description")
      result.map { |x| Search::Presenters::Record::Catalog::Holdings::TableHeading.new(x) }
    end

    def rows
      items.map do |item|
        result = [item.link]
        result.push(item.source)
      end
    end
  end

  class Electronic < Search::Presenters::Record::Catalog::Holdings::Electronic
    def availability_text(item)
      if item.available?
        "Go to online journal"
      else
        "Coming Soon"
      end
    end
  end
end

require_relative "email_holdings"
