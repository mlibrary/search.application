module Search::Presenters::Record::Onlinejournals
  class Email < Search::Presenters::Record::Onlinejournals::Full
    METADATA_METHODS = [
      :main_author,
      :published,
      :series
    ]
    def holdings
      EmailHoldings.new(@record)
    end
  end

  class EmailHoldings
    def initialize(data)
      @data = data
      @holdings = Holdings.new(@data)
    end

    def too_many?
      false
    end

    def any?
      list.any?
    end

    def list
      [
        @holdings.online
      ].reject { |x| x.empty? }
    end
  end
end
