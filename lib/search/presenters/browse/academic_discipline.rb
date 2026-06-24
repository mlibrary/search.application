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
          .map do |discipline|
            AcademicDiscipline.new(discipline: discipline, datastore: @datastore)
          end
      end
    end

    class AcademicDisciplines
      include Enumerable

      def self.for(datastore:)
        data = Search::Models::Browse::AcademicDisciplines.for(datastore: datastore)
        new(data: data, datastore: datastore)
      end

      def initialize(datastore:, data:)
        @data = data
        @datastore = datastore
      end

      def all
        @data.map { |ad| AcademicDiscipline.new(discipline: ad, datastore: @datastore) }
      end

      def each(&block)
        all.each do |discipline|
          block.call(discipline)
        end
      end
    end
  end
end
