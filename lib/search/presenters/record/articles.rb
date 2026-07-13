module Search::Presenters::Record::Articles
  class Full < Search::Presenters::Record::Base
    METADATA_METHODS = [
      :abstract,
      :retraction,
      :author,
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

    def retraction
      if @record.bib.retraction_notice_url
        field_for(
          uid: :retraction,
          field: "Retracted",
          partial: "link_to",
          values: [
            OpenStruct.new(to_s: "This article has been retracted.", url: @record.bib.retraction_notice_url)
          ]
        )
      end
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

  class Brief < Full
    METADATA_METHODS = [
      :author,
      :published_in
    ]

    def to_h
      {
        title: {
          original: @record.bib.title.text
        },
        metadata: metadata.map do |f|
          {
            field: f.field,
            original: f.values&.first&.text
          }
        end,
        url: url,
        citation: {
          ris: ris,
          csl: csl
        },
        holding: {
          call_number: nil,
          location: nil
        }
      }
    end

    def to_json
      to_h.to_json
    end

    private

    def holding
      if holdings.physical.count == 1
        holdings.physical.first.holding
      end
    end
  end
end
