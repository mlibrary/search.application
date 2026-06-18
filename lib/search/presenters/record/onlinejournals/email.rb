module Search::Presenters::Record::Onlinejournals
  class Email < Search::Presenters::Record::Catalog::Email
    METADATA_METHODS = [
      :main_author,
      :published,
      :series
    ]
  end
end
