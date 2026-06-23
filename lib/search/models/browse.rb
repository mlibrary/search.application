class Search::Models::Browse
  def initialize(data)
    @data = data
  end

  def academic_disciplines
    @data.map { |x| AcademicDiscipline.new(data: x) }
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
      @data["disciplines"].map do |x|
        AcademicDiscipline.new(data: x, parents: parents + [self])
      end
    end
  end
end
