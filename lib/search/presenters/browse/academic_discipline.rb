module Search::Presenters
  class Browse
    class AcademicDiscipline
      def initialize(discipline:, datastore:)
        @discipline = discipline
        @disciplines = discipline.disciplines || []
        @datastore = datastore
      end

      def name
        @discipline.name
      end

      def count
        @discipline.count
      end

      def url
        Addressable::URI.new(
          path: "/#{@datastore}",
          query_values: {
            "filter.academic_discipline" => name,
            "sort" => "title_asc"
          }
        ).to_s
      end

      def disciplines
        @disciplines
          .sort_by { |discipline| discipline.name.to_s }
          .map { |discipline| AcademicDiscipline.new(discipline: discipline, datastore: @datastore) }
      end
    end

    class AcademicDisciplines
      ACADEMIC_DISCIPLINES = OpenStruct.new(
        disciplines: [
          OpenStruct.new(
            name: "Business",
            count: 17474,
            disciplines: [
              OpenStruct.new(
                name: "Business (General)",
                count: 11205
              ),
              OpenStruct.new(
                name: "Management",
                count: 2655
              ),
              OpenStruct.new(
                name: "Careers",
                count: 218
              ),
              OpenStruct.new(
                name: "Finance",
                count: 2427
              ),
              OpenStruct.new(
                name: "International Business",
                count: 3017
              ),
              OpenStruct.new(
                name: "Companies and Industry",
                count: 8134
              ),
              OpenStruct.new(
                name: "Entrepreneurship",
                count: 740
              ),
              OpenStruct.new(
                name: "Marketing",
                count: 553
              )
            ]
          ),
          OpenStruct.new(
            name: "Arts",
            count: 5200,
            disciplines: [
              OpenStruct.new(
                name: "Film and Video Studies",
                count: 626
              ),
              OpenStruct.new(
                name: "Landscape Architecture",
                count: 141
              ),
              OpenStruct.new(
                name: "Music",
                count: 814
              ),
              OpenStruct.new(
                name: "Architecture",
                count: 709
              ),
              OpenStruct.new(
                name: "Art and Design",
                count: 1939
              ),
              OpenStruct.new(
                name: "Art History",
                count: 2763
              ),
              OpenStruct.new(
                name: "Dance",
                count: 71,
                disciplines: [
                  OpenStruct.new(
                    name: "Modern Dance",
                    count: 17
                  ),
                  OpenStruct.new(
                    name: "Ballet",
                    count: 11
                  ),
                  OpenStruct.new(
                    name: "World Dance",
                    count: 12
                  )
                ]
              ),
              OpenStruct.new(
                name: "Theatre and Drama",
                count: 416
              )
            ]
          )
        ]
      )
      include Enumerable

      def initialize(datastore:, disciplines: ACADEMIC_DISCIPLINES)
        @disciplines = AcademicDiscipline.new(discipline: disciplines, datastore: datastore)
        @datastore = datastore
      end

      def all
        @disciplines.disciplines
      end

      def each(&block)
        all.each do |discipline|
          block.call(discipline)
        end
      end
    end
  end
end
