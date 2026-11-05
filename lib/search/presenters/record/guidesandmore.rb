module Search::Presenters::Record::Guidesandmore
  class Full < Search::Presenters::Record::Base
    METADATA_METHODS = [
      :type,
      :published,
      :description,
      :author
    ]
    def self.datastore
      "guidesandmore"
    end

    def title
      [OpenStruct.new(text: @record.bib.title.text, css_class: "title-primary")]
    end
    [
      {uid: :type, field: "Type"},
      {uid: :published, field: "Published"},
      {uid: :description, field: "Brief Description"},
      {uid: :author, field: "Author"}
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
    def to_h
      {
        title: @record.bib.title.to_h,
        metadata: metadata.map do |f|
          f.to_h
        end,
        url: url,
        citation: {
          ris: ris,
          csl: csl
        }
      }
    end

    def to_json
      to_h.to_json
    end
  end
end
