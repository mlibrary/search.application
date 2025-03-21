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
            record = Search::Record::Catalog.for(id)
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

          def contributors
            OpenStruct.new(
              field: "Contributors",
              data: @record.bib.contributors.map do |c|
                OpenStruct.new(
                  partial: "browse",
                  locals: c
                )
              end
            )
          end
        end
      end
    end
  end
end
