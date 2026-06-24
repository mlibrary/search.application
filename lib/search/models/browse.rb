module Search::Models::Browse
  class AcademicDisciplines
    def self.for(datastore:)
      new([
        {
          "name" => "Business",
          "count" => 17474,
          "disciplines" => [
            {
              "name" => "Business (General)",
              "count" => 11205
            },
            {
              "name" => "Management",
              "count" => 2655
            },
            {
              "name" => "Careers",
              "count" => 218
            },
            {
              "name" => "Finance",
              "count" => 2427
            },
            {
              "name" => "International Business",
              "count" => 3017
            },
            {
              "name" => "Companies and Industry",
              "count" => 8134
            },
            {
              "name" => "Entrepreneurship",
              "count" => 740
            },
            {
              "name" => "Marketing",
              "count" => 553
            }
          ]
        },
        {
          "name" => "Arts",
          "count" => 5200,
          "disciplines" => [
            {
              "name" => "Film and Video Studies",
              "count" => 626
            },
            {
              "name" => "Landscape Architecture",
              "count" => 141
            },
            {
              "name" => "Music",
              "count" => 814
            },
            {
              "name" => "Architecture",
              "count" => 709
            },
            {
              "name" => "Art and Design",
              "count" => 1939
            },
            {
              "name" => "Art History",
              "count" => 2763
            },
            {
              "name" => "Dance",
              "count" => 71,
              "disciplines" => [
                {
                  "name" => "Modern Dance",
                  "count" => 17
                },
                {
                  "name" => "Ballet",
                  "count" => 11
                },
                {
                  "name" => "World Dance",
                  "count" => 12
                }
              ]
            },
            {
              "name" => "Theatre and Drama",
              "count" => 416
            }
          ]
        }
      ])
    end

    include Enumerable

    def initialize(data)
      @data = data
    end

    def list
      @data.map { |x| AcademicDiscipline.new(data: x) }
    end

    def each(&block)
      list.each do |discipline|
        block.call(discipline)
      end
    end

    class AcademicDiscipline
      attr_reader :parents
      def initialize(data:, parents: [])
        @data = data
        @parents = parents
      end

      def name
        @data["name"]
      end

      def count
        @data["count"]
      end

      def disciplines
        (@data["disciplines"] || []).map do |x|
          AcademicDiscipline.new(data: x, parents: parents + [self])
        end
      end
    end
  end
end
