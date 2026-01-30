module Search::Presenters::Record::Catalog
  class Email < Full
    METADATA_METHODS = [
      :main_author,
      :published,
      :series
    ]
    def holdings
      EmailHoldings.new(@record)
    end
  end
end
