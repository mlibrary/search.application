module Search::Models::Browse
  class AcademicDisciplines
    def self.for(datastore:)
      data = Search::Clients::CatalogAPI.new.get_onlinejournals_academic_disciplines
      new(data)
    rescue => e
      S.logger.error(e)
      new([])
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
