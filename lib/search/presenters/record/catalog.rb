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
            if @record.bib.title.transliterated && @record.bib.title.original
              [
                OpenStruct.new(text: @record.bib.title.transliterated.text, css_class: "title-primary"),
                OpenStruct.new(text: @record.bib.title.original.text, css_class: "title-secondary")
              ]
            elsif @record.bib.title.transliterated
              [OpenStruct.new(text: @record.bib.title.transliterated.text, css_class: "title-primary")]
            else
              [OpenStruct.new(text: @record.bib.title.original.text, css_class: "title-primary")]
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
            {uid: :publisher_number, field: "Publisher Number"},
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
