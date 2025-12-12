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
          [:id, :title, :icons, :metadata].each do |m|
            define_method m do
              raise NotImplementedError
            end
          end
        end

        class Full < Base
          METADATA_METHODS = [
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
            :finding_aids,
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

          def id
            @record.bib.id
          end

          def title
            result = [
              OpenStruct.new(text: @record.bib.title.original.text, css_class: "title-primary")
            ]
            if @record.bib.title.paired?
              result.push OpenStruct.new(text: @record.bib.title.transliterated.text, css_class: "title-secondary")
            end
            result
          end

          def icons
            @record.bib.format.map do |f|
              f.icon
            end
          end

          def respond_to_missing?(method, *args, **kwargs, &block)
            self.class::METADATA_METHODS.any?(method)
          end

          def method_missing(method, *args, **kwargs, &block)
            super unless respond_to_missing?(method)
            S.logger.debug("#{method} not defined in Presenters::Record::Catalog::Full")
            nil
          end

          def metadata
            self.class::METADATA_METHODS.map { |field| public_send(field) }.compact
          end

          def holdings
            Holdings.new(@record)
          end

          def csl
            @record.citation.csl
          end

          def shelf_browse
            @shelf_browse ||= begin
              result = nil
              Yabeda.shelf_browse_api_duration.measure do
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
            {uid: :finding_aids, field: "Indexes/Finding Aids"},
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

          def meta_tags
            @record.citation.meta_tags
          end
        end

        class Brief < Full
          METADATA_METHODS = [
            :main_author,
            :published,
            :series
          ]

          def to_h
            {
              title: {
                original: @record.bib.title.original.text,
                transliterated: @record.bib.title.transliterated&.text
              },
              metadata: metadata.map do |f|
                {
                  field: f.field,
                  original: f.values&.first&.original&.text,
                  transliterated: f.values&.first&.transliterated&.text
                }
              end,
              url: "#{S.base_url}/catalog/record/#{id}",
              citation: {
                ris: @record.citation.ris,
                csl: csl
              }
            }
          end

          def to_json
            to_h.to_json
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
