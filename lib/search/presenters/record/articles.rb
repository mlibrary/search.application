module Search::Presenters::Record::Articles
  class Full < Search::Presenters::Record::Base
    METADATA_METHODS = [
      :retraction,
      :abstract,
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
      if retracted?
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

    def retracted?
      @record.retracted?
    end

    def published_in
      text = [
        {uid: :journal_title, prefix: nil},
        {uid: :volume, prefix: "Volume"},
        {uid: :issue, prefix: "Issue"},
        {uid: :publication_date, prefix: nil},
        {uid: :pages, prefix: "pp."}

      ].map do |part|
        value = @record.bib.public_send(part[:uid])&.first&.text
        if value
          if part[:prefix]
            "#{part[:prefix]} #{value}"
          else
            value
          end
        end
      end.compact.join(", ")
      return nil if text == ""
      field_for(
        uid: :published_in,
        field: "Published in",
        partial: "peer_review",
        values: [
          OpenStruct.new(to_s: text, text: text)
        ]
      )
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
      {uid: :edition, field: "Edition"},
      {uid: :pages, field: "Pages"},
      {uid: :publication_date, field: "Date of publication"}
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
      OpenStruct.new(list: [Holding.new(@record)])
    end
  end

  class Brief < Full
    METADATA_METHODS = [
      :retraction,
      :abstract,
      :author,
      :publication_date,
      :publisher,
      :pages,
      :subject
    ]

    def abstract
      text = @record.bib.abstract&.first&.text
      return nil if text.nil?
      if text.length > 300
        text = text[0, 240] + "..."
      end

      field_for(
        uid: :abstract,
        field: "Abstract",
        partial: "plain_text",
        values: [OpenStruct.new(to_s: text, text: text)]
      )
    end

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
        }
      }
    end

    def to_json
      to_h.to_json
    end
  end

  class Email < Brief
    def holdings
      OpenStruct.new(any?: true, too_many?: false, list: [EmailHolding.new(@record)])
    end
  end

  class Holding
    include Search::Presenters::Record::Holdings

    def initialize(data)
      @holdings = data.holdings
      @data = data
    end

    def kind
      "article"
    end

    def heading
      "Availability"
    end

    def icon
      "devices"
    end

    def empty?
      count == 0
    end

    def count
      @holdings.count
    end

    def table_headings
      result = ["Action", "Description"]
      result.push("Improving Access") if full_text?
      result.map do |x|
        table_heading_for(x)
      end
    end

    def rows
      [lib_key_row, alma_row].compact
    end

    private

    def full_text?
      alma_entry.availability == "full_text"
    end

    def get(source)
      @holdings.items.find { |x| x.source == source }
    end

    def alma_entry
      get("alma")
    end

    def lib_key_entry
      get("lib_key")
    end

    def lib_key_row
      if lib_key_entry
        [
          link_to_cell_for(text: "View PDF", url: lib_key_entry.url),
          # we will never get a citation only retracted pdf because we don't have full text access. (should it be that way??)
          @data.retracted? ? retracted_cell : success_cell_for("Full text available"),
          improving_access_cell(:libkey)
        ]
      end
    end

    def alma_row
      if full_text?
        [
          link_to_cell_for(text: "Go to item", url: alma_entry.url),
          @data.retracted? ? retracted_cell : success_cell_for("Full text available"),
          improving_access_cell(:alma)
        ]
      else
        [
          link_to_cell_for(text: "Go to item", url: alma_entry.url),
          @data.retracted? ? retracted_cell : warning_cell_for("Citation only")
        ]
      end
    end

    def retracted_cell
      error_cell_for("Retracted")
    end

    def improving_access_cell(kind)
      report_source = (kind == :libkey) ? "ArticlesSearch-LibKey-GoToPDF" : "ArticlesSearch"
      improving_access_cell_for(improving_access_url(report_source))
    end

    def improving_access_url(report_source)
      Addressable::URI.new(
        scheme: "https",
        host: "umich.qualtrics.com",
        path: "/jfe/form/SV_2broDMHlZrBYwJL",
        query_values: {
          DocumentID: "#{S.base_url}/primo/record/#{@data.bib.id}",
          LinkModel: "unknown",
          ReportSource: report_source
        }
      ).display_uri.to_s
    end
  end

  class EmailHolding < Holding
    def table_headings
      ["Action", "Description"]
    end

    private

    def lib_key_row
      remove_improving_access(super)
    end

    def alma_row
      remove_improving_access(super)
    end

    def remove_improving_access(result)
      if result.is_a?(Array) && result.count == 3
        result.pop
      end
      result
    end
  end
end
