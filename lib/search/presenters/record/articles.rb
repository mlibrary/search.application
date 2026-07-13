module Search::Presenters::Record::Articles
  class Full < Search::Presenters::Record::Base
    METADATA_METHODS = [
      :author,
      :abstract,
      :published_in,
      :publisher,
      :genre,
      :issn,
      :eissn,
      :isbn,
      :eisbn,
      :doi,
      :oclc,
      :pmid,
      :language,
      :subject,
      :edition
    ]

    def self.datastore
      "articles"
    end

    def title
      [OpenStruct.new(text: @record.bib.title.text, css_class: "title-primary")]
    end

    [
      {uid: :author, field: "Author"}
    ].each do |f|
      define_method(f[:uid]) do
        if @record.bib.public_send(f[:uid]).present?
          field_for(
            uid: f[:uid],
            field: f[:field],
            partial: "link_to",
            values: @record.bib.public_send(f[:uid])
          )
        end
      end
    end

    [
      {uid: :abstract, field: "Abstract"},
      {uid: :published_in, field: "Published in"},
      {uid: :publisher, field: "Publisher"},
      {uid: :genre, field: "Genre"},
      {uid: :issn, field: "ISSN"},
      {uid: :eisn, field: "EISN"},
      {uid: :isbn, field: "ISBN"},
      {uid: :eisbn, field: "EISBN"},
      {uid: :doi, field: "DOI"},
      {uid: :oclc, field: "OCLC"},
      {uid: :pmid, field: "PMID"},
      {uid: :language, field: "Language"},
      {uid: :subject, field: "Subject"},
      {uid: :edition, field: "Edition"}
    ].each do |f|
      define_method(f[:uid]) do
        if @record.bib.public_send(f[:uid]).present?
          field_for(
            uid: f[:uid],
            field: f[:field],
            partial: "plain_text",
            values: @record.bib.public_send(f[:uid])
          )
        end
      end
    end

    def holdings
      OpenStruct.new(list: [])
    end
  end
end
