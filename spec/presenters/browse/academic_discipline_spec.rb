describe Search::Presenters::Browse::AcademicDiscipline do
  let(:academic_discipline_model) do
    ad_parent = instance_double(Search::Models::Browse::AcademicDisciplines::AcademicDiscipline, name: "Business", count: 999)
    ad_child = instance_double(Search::Models::Browse::AcademicDisciplines::AcademicDiscipline, name: "Administration", count: 888, disciplines: [])
    allow(ad_parent).to receive(:disciplines).and_return([ad_child])
    allow(ad_child).to receive(:parents).and_return([ad_parent])
    ad_parent
  end
  before(:each) do
    @datastore = "onlinejournals"
  end

  subject do
    described_class.new(discipline: academic_discipline_model, datastore: @datastore)
  end

  context "#name" do
    it "returns the name of the discipline" do
      expect(subject.name).to eq("Business")
    end

    context "#count" do
      it "returns the count of the discipline" do
        expect(subject.count).to eq(999)
      end
    end

    context "#url" do
      it "generates a URL with the correct query parameters" do
        expect(subject.url).to eq("/#{@datastore}?filter.academic_discipline=Business&sort=title_asc")
      end
    end

    context "#disciplines" do
      it "returns an array of AcademicDiscipline objects" do
        expect(subject.disciplines).to all(be_a(Search::Presenters::Browse::AcademicDiscipline))
      end

      it "returns the correct number of disciplines" do
        expect(subject.disciplines.length).to eq(1)
      end

      it "returns disciplines with the correct names and counts" do
        subject_disciplines = subject.disciplines
        expect(subject_disciplines.first.name).to eq("Administration")
        expect(subject_disciplines.first.count).to eq(888)
      end
    end
  end
end

describe Search::Presenters::Browse::AcademicDisciplines do
  let(:datastore) { "onlinejournals" }
  let(:ad_model) do
    ad_parent = instance_double(Search::Models::Browse::AcademicDisciplines::AcademicDiscipline, name: "Business", count: 999)
    ad_child = instance_double(Search::Models::Browse::AcademicDisciplines::AcademicDiscipline, name: "Administration", count: 888)
    allow(ad_parent).to receive(:disciplines).and_return([ad_child])
    allow(ad_child).to receive(:parents).and_return([ad_parent])
    [ad_parent]
  end

  subject do
    described_class.new(datastore: datastore, data: ad_model)
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
