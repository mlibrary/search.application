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

          def record_info
            [format, contributors]
          end

          def marc_record
          end

          def indexing_date
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
          [
            {uid: :edition, field: "Edition"},
            {uid: :series, field: "Series (transcribed)"},
            {uid: :series_statement, field: "Series Statement"},
            {uid: :note, field: "Note"},
            {uid: :physical_description, field: "Physical Description"}
          ].each do |f|
            define_method(f[:uid]) do
              PlainTextField.for(field: f[:field], data: @record.bib.public_send(f[:uid]).slice(0, 1))
            end
          end

          [
            {uid: :language, field: "Language"},
            {uid: :published, field: "Published/Created"},
            {uid: :manufactured, field: "Manufactured"},
            {uid: :oclc, field: "OCLC Number"},
            {uid: :isbn, field: "ISBN"}
          ].each do |f|
            define_method(f[:uid]) do
              PlainTextField.for(field: f[:field], data: @record.bib.public_send(f[:uid]))
            end
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
      end
    end
  end
end
