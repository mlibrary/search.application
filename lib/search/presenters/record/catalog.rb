module Search
  module Presenters
    module Record
      module Catalog
      end
    end
  end
end

require_relative "catalog/holdings"
require_relative "catalog/shelf_browse"

module Search
  module Presenters
    module Record
      module Catalog
        class Base
          [:title, :icons, :record_info].each do |m|
            define_method m do
              raise NotImplementedError
            end
          end
        end

        class Full < Base
          RECORD_INFO_METHODS = [
            :format, # 00-catalog mirlyn_format
            :main_author,
            :preferred_title,
            :related_title,
            :other_titles,
            :new_title,
            :new_title_issn,
            :previous_title,
            :previous_title_issn,
            :contributors,
            :published,
            :created,
            :distributed,
            :manufactured,
            :edition,
            :series,
            :series_statement,
            :biography_history,
            :summary, # 00-catalog mirlyn summary
            :in_collection,
            :access, # 00-catalog marc_access
            # :indexes, 00-catalog ???
            :terms_of_use,
            :language,
            :language_note,
            :performers,
            :date_place_of_event,
            :preferred_citation,
            :location_of_originals,
            :funding_information,
            :source_of_acquisition,
            :related_items,
            :numbering,
            :current_publication_frequency,
            :former_publication_frequency,
            :numbering_notes,
            :source_of_description_note,
            :copy_specific_note,
            :references,
            :copyright_status_information,
            :note,
            :arrangement,
            :copyright,
            :physical_description,
            :map_scale,
            :reproduction_note,
            :original_version_note,
            :playing_time,
            :media_format,
            :audience,
            :content_advice,
            :awards,
            :production_credits,
            :bibliography,
            :isbn,
            :issn, # 00-catalog marc_issn
            :call_number, # 00-catalog callnumber_browse
            :oclc,
            :gov_doc_number,
            :publisher_number,
            :report_number,
            :chronology,
            :place,
            :printer,
            :association,
            :lc_subjects,
            :remediated_lc_subjects,
            :other_subjects,
            :academic_discipline,
            :contents, # 00-catalog contents_listing
            :bookplate,
            :extended_summary
          ]

          def self.for(id)
            record = Search::Models::Record::Catalog.for(id)
            new(record)
          end

          def initialize(record)
            @record = record
          end

          def title
            if @record.bib.title.paired?
              [
                OpenStruct.new(text: @record.bib.title.original.text, css_class: "title-primary"),
                OpenStruct.new(text: @record.bib.title.transliterated.text, css_class: "title-secondary")
              ]
            else
              [OpenStruct.new(text: @record.bib.title.text, css_class: "title-primary")]
            end
          end

          def icons
            @record.bib.format.map do |f|
              f.icon
            end
          end

          def respond_to_missing?(method, *args, **kwargs, &block)
            RECORD_INFO_METHODS.any?(method)
          end

          def method_missing(method, *args, **kwargs, &block)
            super unless respond_to_missing?(method)
            S.logger.debug("#{method} not defined in Presenters::Record::Catalog::Full")
            nil
          end

          def record_info
            RECORD_INFO_METHODS.map { |field| public_send(field) }.compact
          end

          def holdings
            Holdings.new(@record)
          end

          def citations
            OpenStruct.new(
              mla: "<i>Birds</i>. v. 1-Jan./Feb. 1966-, 1966-2013.",
              apa: "<i>Birds</i> (No. v. 1-Jan./Feb. 1966-). (1966-2013).",
              chicago: "\"Birds,\" 1966-2013.",
              ieee: "\"Birds,\" Art. no. v. 1-Jan./Feb. 1966-, 1966-2013.",
              nlm: "Birds. Sandy, Bedfordshire, Eng.: Royal Society for the Protection of Birds; 1966-2013;",
              bibtex: "@article{Birds_1966-2013, address={Sandy, Bedfordshire, Eng.}, callNumber={QL671 .B678}, number={v. 1-Jan./Feb. 1966-}, publisher={Royal Society for the Protection of Birds}, year={1966-2013} }"
            )
          end

          def shelf_browse
            @shelf_browse ||= begin
              result = nil
              Yabeda.shelf_browse_api_duration_seconds.measure do
                result = ShelfBrowse.for(call_number: @record.bib.call_number&.first&.text)
              end
              result
            end
          end

          def indexing_date
            @record.indexing_date.strftime("%B %-d, %Y")
          end

          def marc_record
            @record.marc
          end

          def format
            Field.for(
              uid: "format",
              field: "Formats",
              partial: "format",
              values: @record.bib.format
            )
          end

          [
            {uid: :main_author, field: "Author/Creator"},
            {uid: :contributors, field: "Contributors"}
          ].each do |f|
            define_method(f[:uid]) do
              if @record.bib.public_send(f[:uid]).present?
                Field.for(
                  uid: f[:uid],
                  field: f[:field],
                  partial: "browse",
                  values: @record.bib.public_send(f[:uid])
                )
              end
            end
          end

          [
            {uid: :call_number, field: "Call Number"},
            {uid: :lc_subjects, field: "Subjects (LCSH)"},
            {uid: :remediated_lc_subjects, field: "Subjects (Local)"}
          ].each do |f|
            define_method(f[:uid]) do
              if @record.bib.public_send(f[:uid]).present?
                Field.for(
                  uid: f[:uid],
                  field: f[:field],
                  partial: "browse",
                  values: @record.bib.public_send(f[:uid])
                )
              end
            end
          end

          [
            {uid: :new_title, field: "New Title"},
            {uid: :other_titles, field: "Other Titles"},
            {uid: :preferred_title, field: "Preferred Title"},
            {uid: :previous_title, field: "Previous Title"},
            {uid: :related_title, field: "Related Title"}
          ].each do |f|
            define_method(f[:uid]) do
              if @record.bib.public_send(f[:uid]).present?
                Field.for(
                  uid: f[:uid],
                  field: f[:field],
                  partial: "link_to",
                  values: @record.bib.public_send(f[:uid])
                )
              end
            end
          end

          # Parallel Plain text content
          [
            {uid: :access, field: "Access"},
            {uid: :arrangement, field: "Arrangement"},
            {uid: :edition, field: "Edition"},
            {uid: :association, field: "Association"},
            {uid: :audience, field: "Audience"},
            {uid: :awards, field: "Awards"},
            {uid: :bibliography, field: "Bibliography"},
            {uid: :biography_history, field: "Biography/History"},
            {uid: :chronology, field: "Chronology"},
            {uid: :content_advice, field: "Content advice"},
            {uid: :copy_specific_note, field: "Copy Specific Note"},
            {uid: :copyright, field: "Copyright"},
            {uid: :copyright_status_information, field: "Copyright status information"},
            {uid: :created, field: "Created"},
            {uid: :current_publication_frequency, field: "Current Publication Frequency"},
            {uid: :date_place_of_event, field: "Date/Place of Event"},
            {uid: :distributed, field: "Distributed"},
            {uid: :extended_summary, field: "Expanded Summary"},
            {uid: :former_publication_frequency, field: "Former Publication Frequency"},
            {uid: :funding_information, field: "Funding Information"},
            {uid: :in_collection, field: "In Collection"},
            {uid: :language_note, field: "Language note"},
            {uid: :location_of_originals, field: "Location of Originals"},
            {uid: :manufactured, field: "Manufactured"},
            {uid: :map_scale, field: "Map Scale"},
            {uid: :media_format, field: "Media Format"},
            {uid: :note, field: "Note"},
            {uid: :numbering, field: "Numbering"},
            {uid: :numbering_notes, field: "Numbering Note"},
            {uid: :original_version_note, field: "Original version note"},
            {uid: :performers, field: "Performers"},
            {uid: :physical_description, field: "Physical Description"},
            {uid: :place, field: "Place"},
            {uid: :playing_time, field: "Playing Time"},
            {uid: :preferred_citation, field: "Preferred Citation"},
            {uid: :printer, field: "Printer"},
            {uid: :production_credits, field: "Production Credits"},
            {uid: :published, field: "Published/Created"},
            {uid: :publisher_number, field: "Publisher Number"},
            {uid: :references, field: "References"},
            {uid: :related_items, field: "Related Items"},
            {uid: :reproduction_note, field: "Reproduction note"},
            {uid: :series, field: "Series (transcribed)"},
            {uid: :series_statement, field: "Series Statement"},
            {uid: :source_of_acquisition, field: "Source of Acquisition"},
            {uid: :source_of_description_note, field: "Source of Description Note"},
            {uid: :summary, field: "Summary"},
            {uid: :terms_of_use, field: "Terms of Use"}
          ].each do |f|
            define_method(f[:uid]) do
              if @record.bib.public_send(f[:uid]).present?
                Field.for(
                  uid: f[:uid],
                  field: f[:field],
                  partial: "plain_text",
                  values: @record.bib.public_send(f[:uid])
                )
              end
            end
          end

          # Plain content, single field display
          [
            {uid: :contents, field: "Contents"},
            {uid: :gov_doc_number, field: "Government Document Number"},
            {uid: :report_number, field: "Report Number"}
          ].each do |f|
            define_method(f[:uid]) do
              if @record.bib.public_send(f[:uid]).present?
                Field.for(
                  uid: f[:uid],
                  field: f[:field],
                  partial: "plain_text",
                  values: @record.bib.public_send(f[:uid]).slice(0, 1)
                )
              end
            end
          end

          # Plain content, multiple field display
          [
            {uid: :bookplate, field: "Donor Information"},
            {uid: :isbn, field: "ISBN"},
            {uid: :issn, field: "ISSN"},
            {uid: :language, field: "Language"},
            {uid: :new_title_issn, field: "New Title ISSN"},
            {uid: :previous_title_issn, field: "Previous Title ISSN"},
            {uid: :oclc, field: "OCLC Number"},
            {uid: :other_subjects, field: "Subjects (Other)"}
          ].each do |f|
            define_method(f[:uid]) do
              Field.for(field: f[:field],
                uid: f[:uid],
                partial: "plain_text",
                values: @record.bib.public_send(f[:uid]))
            end
          end

          def academic_discipline
            Field.for(
              uid: "academic_discipline",
              field: "Academic Discipline",
              partial: "academic_discipline",
              values: @record.bib.academic_discipline
            )
          end

          def ris_tags
            # https://www.zotero.org/support/dev/exposing_metadata
            # https://webmasters.stackexchange.com/a/139313
            # https://div.div1.com.au/div-thoughts/div-commentaries/66-div-commentary-metadata
            # https://en.wikipedia.org/wiki/RIS_(file_format)#cite_ref-:3_14-49
            [
              {
                "RIS" => "A1",
                "Meta" => ["citation_author**"],
                "Note(s)" => "Synonym of AU.",
                "Done" => true
              },
              {
                "RIS" => "A2",
                "Meta" => ["citation_author", "citation_author_institution", "citation_editor", "citation_technical_report_institution", "citation_dissertation_institution"],
                "Note(s)" => "The tag must be repeated for each person. Synonym of ED.",
                "Done" => true
              },
              {
                "RIS" => "A3",
                "Meta" => ["citation_author", "citation_editor", "citation_publisher"],
                "Note(s)" => "The tag must be repeated for each person.",
                "Done" => true
              },
              {
                "RIS" => "A4",
                "Meta" => ["citation_author", "citation_editor"],
                "Note(s)" => "The tag must be repeated for each person.",
                "Done" => true
              },
              {
                "RIS" => "A5",
                "Meta" => ["citation_author", "citation_editor"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "A6",
                "Meta" => ["citation_author", "citation_editor"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "AB",
                "Meta" => ["citation_abstract**"],
                "Note(s)" => "Synonym of N2.",
                "Done" => true
              },
              {
                "RIS" => "AD",
                "Meta" => ["citation_author_email", "citation_author_institution", "citation_dissertation_institution", "citation_technical_report_institution"],
                "Note(s)" => "(Author/editor/inventor) address, e.g. ... email address, ... Institution.",
                "Done" => true
              },
              {
                "RIS" => "AN",
                "Meta" => ["citation_collection_id", "citation_id"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "AU",
                "Meta" => ["citation_author", "citation_author_institution", "citation_editor", "citation_technical_report_institution", "citation_dissertation_institution"],
                "Note(s)" => "Synonym of A1, but A1 doesn't include editor?",
                "Done" => true
              },
              {
                "RIS" => "AV",
                "Meta" => ["citation_fulltext_world_readable"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "BT",
                "Meta" => ["citation_title", "citation_book_title", "citation_inbook_title"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "C1",
                "Meta" => ["citation_section", "citation_year"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "C2",
                "Meta" => ["citation_year", "citation_technical_report_number"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "C3",
                "Meta" => ["citation_year"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "C4",
                "Meta" => ["citation_fulltext_world_readable"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "C5",
                "Meta" => ["citation_publisher"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "C6",
                "Meta" => ["citation_volume"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "C7",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "C8",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "CA",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "CL",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "CN",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "CP",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "CR",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "CT",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "CY",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "DA",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "DB",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "DI",
                "Meta" => ["citation_doi"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "DO",
                "Meta" => ["citation_doi"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "DOI",
                "Meta" => ["citation_doi"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "DP",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "DS",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "ED",
                "Meta" => ["citation_editor**", "citation_author"],
                "Note(s)" => "Synonym of A2.",
                "Done" => true
              },
              {
                "RIS" => "EP",
                "Meta" => ["citation_firstpage", "citation_lastpage**"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "ER",
                "Meta" => ["citation_reference"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "ET",
                "Meta" => ["citation_patent_number", "citation_patent_country"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "FD",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "H1",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "H2",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "ID",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "IP",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "IS",
                "Meta" => ["citation_issue**", "citation_volume"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "J1",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "J2",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "JA",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "JF",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "JO",
                "Meta" => ["citation_journal_abbrev"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "K1",
                "Meta" => ["citation_keywords"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "KW",
                "Meta" => ["citation_keywords"],
                "Note(s)" => "Separated by a semicolon.",
                "Done" => true
              },
              {
                "RIS" => "L1",
                "Meta" => ["citation_pdf_url**"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "L2",
                "Meta" => ["citation_fulltext_html_url**"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "L3",
                "Meta" => ["citation_doi"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "L4",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "LA",
                "Meta" => ["citation_language**"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "LB",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "LK",
                "Meta" => ["citation_abstract_html_url", "citation_abstract_pdf_url", "citation_fulltext_html_url", "citation_pdf_url", "citation_public_url"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "LL",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "M1",
                "Meta" => ["citation_firstpage", "citation_volume**"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "M2",
                "Meta" => ["citation_firstpage**"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "M3",
                "Meta" => ["citation_patent_number"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "N1",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "N2",
                "Meta" => ["citation_abstract"],
                "Note(s)" => "Synonym of AB.",
                "Done" => true
              },
              {
                "RIS" => "NO",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "NV",
                "Meta" => ["citation_volume", "citation_patent_number"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "OL",
                "Meta" => ["citation_language"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "OP",
                "Meta" => ["citation_firstpage"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "PA",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "PB",
                "Meta" => ["citation_publisher**"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "PMCID",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "PMID",
                "Meta" => ["citation_pmid"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "PP",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "PY",
                "Meta" => ["citation_year"],
                "Note(s)" => "Synonym of Y1.",
                "Done" => nil
              },
              {
                "RIS" => "RD",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "RI",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "RN",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "RP",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "RT",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "SE",
                "Meta" => ["citation_firstpage", "citation_patent_number"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "SF",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "SL",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "SN",
                "Meta" => ["citation_issn**", "citation_isbn", "citation_technical_report_number", "citation_patent_number"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "SP",
                "Meta" => ["citation_firstpage**"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "SR",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "ST",
                "Meta" => ["citation_journal_abbrev"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "SV",
                "Meta" => ["citation_volume"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "T1",
                "Meta" => ["citation_title"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "T2",
                "Meta" => ["citation_series_title"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "T3",
                "Meta" => ["citation_volume", "citation_series_title"],
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "TA",
                "Meta" => ["citation_author", "citation_editor"],
                "Note(s)" => "If transliterated takes priority over original",
                "Done" => nil
              },
              {
                "RIS" => "TI",
                "Meta" => ["citation_title"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "TT",
                "Meta" => ["citation_title"],
                "Note(s)" => "If transliterated takes priority over original",
                "Done" => true
              },
              {
                "RIS" => "TY",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "U1",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "U2",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "U3",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "U4",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "U5",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "U6",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "U7",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "U8",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "U9",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "U10",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "U11",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "U12",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "U13",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "U13",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "U14",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "U15",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => nil
              },
              {
                "RIS" => "UR",
                "Meta" => ["citation_public_url**", "citation_fulltext_html_url", "citation_pdf_url", "citation_abstract_html_url", "citation_abstract_pdf_url"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "VL",
                "Meta" => ["citation_volume**", "citation_year", "citation_patent_number"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "VO",
                "Meta" => ["citation_volume**"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "WP",
                "Meta" => ["citation_publication_date**", "citation_online_date", "citation_date"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "WT",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "WV",
                "Meta" => nil,
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "Y1",
                "Meta" => ["citation_date**", "citation_year"],
                "Note(s)" => "Synonym of PY.",
                "Done" => true
              },
              {
                "RIS" => "Y2",
                "Meta" => ["citation_date", "citation_online_date", "citation_publication_date"],
                "Note(s)" => nil,
                "Done" => true
              },
              {
                "RIS" => "YR",
                "Meta" => ["citation_year**"],
                "Note(s)" => nil,
                "Done" => true
              }
            ]
          end

          def meta_tags
            # https://www.zotero.org/support/dev/exposing_metadata#using_an_open_standard_for_exposing_metadata
            # https://div.div1.com.au/div-thoughts/div-commentaries/66-div-commentary-metadata
            # https://en.wikipedia.org/wiki/RIS_(file_format)
            [
              {
                "name" => "title",
                "content" => ":title.original"
              },
              {
                "name" => "author",
                "content" => ":main_author.original"
              },
              {
                "name" => "author",
                "content" => ":contributors.original"
              }
            ]
          end
        end

        class Field
          def self.for(field:, partial:, values:, uid: nil)
            new(uid: uid, field: field, partial: partial, values: values) if values.present?
          end
          attr_reader :uid, :field, :partial, :values
          def initialize(field:, partial:, values:, uid: nil)
            @field = field
            @partial = partial
            @values = values
            @uid = uid
          end

          include Enumerable

          def each(&block)
            @values.each(&block)
          end
        end
      end
    end
  end
end
