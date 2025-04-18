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
          # order matters!
          RECORD_INFO_METHODS = [
            :format, # 00-catalog mirlyn_format
            :main_author,
            :contributors,
            # :uniform_title, 00-catalog ???
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
            :gov_doc_no,
            :publisher_number,
            :report_number,
            :chronology,
            :place,
            :printer,
            :association,
            :lcsh_subjects, # 00-catalog lc_subject_display
            :remediated_lcsh_subjects, # 00-catalog remediated_lc_subject_display
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
            out = [OpenStruct.new(text: @record.bib.title, css_class: "title")]
            unless @record.bib.vernacular_title.nil?
              out.append(OpenStruct.new(text: @record.bib.vernacular_title, css_class: "vernacular"))
            end
            out
          end

          def icons
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

          def marc_record
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

          def indexing_date
            "20250217"
          end

          def format
            OpenStruct.new(
              field: "Formats",
              data: @record.bib.format
            )
          end

          def main_author
            BrowseField.for(field: "Author/Creator", data: [@record.bib.main_author, @record.bib.vernacular_main_author])
          end

          [
            {uid: :call_number, field: "Call Number"},
            {uid: :lcsh_subjects, field: "Subjects (LCSH)"}
          ].each do |f|
            define_method(f[:uid]) do
              BrowseField.for(field: f[:field], data: @record.bib.public_send(f[:uid]))
            end
          end
          def contributors
            BrowseField.for(field: "Contributors", data: @record.bib.contributors)
          end

          def other_titles
            LinkToField.for(field: "Other Titles", data: @record.bib.other_titles)
          end

          def related_title
            LinkToField.for(field: "Related Title", data: @record.bib.related_title)
          end

          # Plain content, single field display
          [
            {uid: :association, field: "Association"},
            {uid: :audience, field: "Audience"},
            {uid: :bibliography, field: "Bibliography"},
            {uid: :biography_history, field: "Biography/History"},
            {uid: :chronology, field: "Chronology"},
            {uid: :copyright, field: "Copyright"},
            {uid: :copyright_status_information, field: "Copyright status information"},
            {uid: :created, field: "Created"},
            {uid: :current_publication_frequency, field: "Current Publication Frequency"},
            {uid: :date_place_of_event, field: "Date/Place of Event"},
            {uid: :edition, field: "Edition"},
            {uid: :extended_summary, field: "Expanded Summary"},
            {uid: :former_publication_frequency, field: "Former Publication Frequency"},
            {uid: :gov_doc_no, field: "Government Document Number"},
            {uid: :in_collection, field: "In Collection"},
            {uid: :map_scale, field: "Map Scale"},
            {uid: :note, field: "Note"},
            {uid: :numbering, field: "Numbering"},
            {uid: :physical_description, field: "Physical Description"},
            {uid: :place, field: "Place"},
            {uid: :playing_time, field: "Playing Time"},
            {uid: :printer, field: "Printer"},
            {uid: :production_credits, field: "Production Credits"},
            {uid: :publisher_number, field: "Publisher Number"},
            {uid: :references, field: "References"},
            {uid: :report_number, field: "Report Number"},
            {uid: :series, field: "Series (transcribed)"},
            {uid: :series_statement, field: "Series Statement"},
            {uid: :terms_of_use, field: "Terms of Use"}
          ].each do |f|
            define_method(f[:uid]) do
              PlainTextField.for(field: f[:field], data: @record.bib.public_send(f[:uid]).slice(0, 1))
            end
          end

          # Plain content, multiple field display
          [
            {uid: :access, field: "Access"},
            {uid: :arrangement, field: "Arrangement"},
            {uid: :awards, field: "Awards"},
            {uid: :bookplate, field: "Donor Information"},
            {uid: :content_advice, field: "Content advice"},
            {uid: :contents, field: "Contents Listing"},
            {uid: :copy_specific_note, field: "Copy Specific Note"},
            {uid: :distributed, field: "Distributed"},
            {uid: :funding_information, field: "Funding Information"},
            {uid: :isbn, field: "ISBN"},
            {uid: :issn, field: "ISSN"},
            {uid: :language, field: "Language"},
            {uid: :language_note, field: "Language note"},
            {uid: :location_of_originals, field: "Location of Originals"},
            {uid: :manufactured, field: "Manufactured"},
            {uid: :media_format, field: "Media Format"},
            {uid: :numbering_notes, field: "Numbering Note"},
            {uid: :new_title_issn, field: "New Title ISSN"},
            {uid: :oclc, field: "OCLC Number"},
            {uid: :original_version_note, field: "Original version note"},
            {uid: :performers, field: "Performers"},
            {uid: :preferred_citation, field: "Preferred Citation"},
            {uid: :previous_title_issn, field: "Previous Title ISSN"},
            {uid: :published, field: "Published/Created"},
            {uid: :related_items, field: "Related Items"},
            {uid: :reproduction_note, field: "Reproduction note"},
            {uid: :source_of_acquisition, field: "Source of Acquisition"},
            {uid: :source_of_description_note, field: "Source of Description Note"},
            {uid: :summary, field: "Summary"}
          ].each do |f|
            define_method(f[:uid]) do
              PlainTextField.for(field: f[:field], data: @record.bib.public_send(f[:uid]))
            end
          end

          def academic_discipline
            AcademicDisciplineField.for(field: "Academic Discipline", data: @record.bib.academic_discipline)
          end
        end

        class Field
          attr_reader :field
          def self.for(field:, data:)
            compact_data = data.compact
            new(field: field, data: compact_data) if compact_data.present?
          end

          def initialize(field:, data:)
            @field = field
            @data = data
          end

          def data
            @data.map do |i|
              OpenStruct.new(
                partial: partial,
                locals: item(i)
              )
            end
          end

          def partial
            raise NotImplementedError
          end

          def item(i)
            raise NotImplementedError
          end
        end

        class PlainTextField < Field
          def partial
            "plain_text"
          end

          def item(i)
            OpenStruct.new(text: i.text)
          end
        end

        class LinkToField < Field
          def partial
            "link_to"
          end

          def item(i)
            OpenStruct.new(
              text: i.text,
              url: i.url
            )
          end
        end

        class BrowseField < Field
          def partial
            "browse"
          end

          def item(i)
            OpenStruct.new(
              text: i.text,
              url: i.url,
              browse_url: i.browse_url,
              kind: i.kind
            )
          end
        end

        class AcademicDisciplineField < Field
          def partial
            "academic_discipline"
          end

          def item(i)
            OpenStruct.new(
              disciplines: i
            )
          end
        end
      end
    end
  end
end
