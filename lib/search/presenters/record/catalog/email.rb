module Search::Presenters::Record::Catalog
  class Email < Full
    def holdings
      EmailHoldings.new(@record)
    end
  end
end
