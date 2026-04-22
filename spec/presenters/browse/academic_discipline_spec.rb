describe Search::Presenters::Browse::AcademicDiscipline do
  before(:each) do
    @discipline = OpenStruct.new(
      name: "Arts",
      count: 5200,
      disciplines: [
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
              name: "Ballet",
              count: 11
            ),
            OpenStruct.new(
              name: "Modern Dance",
              count: 60
            )
          ]
        )
      ]
    )
    @disciplines = @discipline.disciplines
    @slug = "onlinejournals"
  end

  subject do
    described_class.new(discipline: @discipline, slug: @slug)
  end

  context "#name" do
    it "returns the name of the discipline" do
      expect(subject.name).to eq(@discipline.name)
    end
  end

  context "#count" do
    it "returns the count of the discipline" do
      expect(subject.count).to eq(@discipline.count)
    end
  end

  context "#url" do
    it "generates a URL with the correct query parameters" do
      expect(subject.url).to eq( "/#{@slug}?filter.academic_discipline=#{@discipline.name}&sort=title_asc")
    end
  end

  context "#disciplines" do
    it "returns an array of AcademicDiscipline objects" do
      expect(subject.disciplines).to all(be_a(Search::Presenters::Browse::AcademicDiscipline))
    end

    it "returns the correct number of disciplines" do
      expect(subject.disciplines.length).to eq(@disciplines.length)
    end

    it "returns disciplines with the correct names and counts" do
      subject_disciplines = subject.disciplines
      @disciplines.each_with_index do |discipline, index|
        expect(subject_disciplines[index].name).to eq(discipline.name)
        expect(subject_disciplines[index].count).to eq(discipline.count)
      end
    end
  end
end

describe Search::Presenters::Browse::AcademicDisciplines do
  before(:each) do
    @datastore = "onlinejournals"
    @disciplines = Search::Presenters::Browse::AcademicDisciplines::ACADEMIC_DISCIPLINES
  end

  subject do
    described_class.new(datastore: @datastore)
  end

  context "#all" do
    it "returns an array of AcademicDiscipline objects" do
      expect(subject.all).to all(be_a(Search::Presenters::Browse::AcademicDiscipline))
    end
  end

  context "#each" do
    it "iterates over the academic disciplines" do
      academic_disciplines = []
      subject.each do |academic_discipline|
        academic_disciplines << academic_discipline
      end

      expect(academic_disciplines).to eq(subject.all)
    end
  end
end
