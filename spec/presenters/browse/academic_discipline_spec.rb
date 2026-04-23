describe Search::Presenters::Browse::AcademicDiscipline do
  before(:each) do
    @discipline = Search::Presenters::Browse::AcademicDisciplines::ACADEMIC_DISCIPLINES.disciplines.sort_by { |discipline| discipline.name.to_s }.first
    @disciplines = @discipline.disciplines || []
    @datastore = "onlinejournals"
  end

  subject do
    described_class.new(discipline: @discipline, datastore: @datastore)
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
      expect(subject.url).to eq( "/#{@datastore}?filter.academic_discipline=#{subject.name}&sort=title_asc")
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
      sorted_by_name = @disciplines.sort_by { |d| d.name.to_s }

      sorted_by_name.each_with_index do |discipline, index|
        expect(subject_disciplines[index].name).to eq(discipline.name)
        expect(subject_disciplines[index].count).to eq(discipline.count)
      end
    end
  end
end

describe Search::Presenters::Browse::AcademicDisciplines do
  let(:datastore) { "onlinejournals" }

  subject do
    described_class.new(datastore: datastore, disciplines: Search::Presenters::Browse::AcademicDisciplines::ACADEMIC_DISCIPLINES)
  end

  context "#all" do
    it "returns an array of AcademicDiscipline objects" do
      expect(subject.all).to all(be_a(Search::Presenters::Browse::AcademicDiscipline))
    end
  end

  context "#each" do
    it "iterates over the academic disciplines" do
      academic_discipline_names = []
      subject.each do |academic_discipline|
        academic_discipline_names << academic_discipline.name
      end

      expect(academic_discipline_names).to eq(subject.all.map(&:name))
    end
  end
end
