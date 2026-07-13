class Search::Models::Record::Articles::Bib
  # map_*_field methods come from this
  include Search::Models::Record::Metadata

  def initialize(data)
    @data = data
    @datastore = "articles"
  end

  [:id, :peer_reviewed, :retraction_notice_url].each do |uid|
    define_method(uid) do
      @data[uid.to_s]
    end
  end

  def title
    map_text_field("title").first
  end

  def author
    map_field("author") do |item|
      LinkToItem.new(data: item, datastore: @datastore)
    end
  end

  [
    :abstract, :published_in, :publisher, :genre, :issn, :eissn,
    :isbn, :eisbn, :doi, :oclc, :pmid, :language, :subject, :edition
  ].each do |uid|
    define_method(uid) { map_text_field(uid.to_s) }
  end
end
