describe Search::Presenters::Browse::Title do
  before(:each) do
    @title = "M"
    @slug = "onlinejournals"
  end

  subject do
    described_class.new(title: @title, slug: @slug)
  end

  context "#title" do
    it "returns a string" do
      expect(subject.title).to eq(@title)
    end
  end

  context "#url" do
    it "generates a URL with the correct query parameters" do
      expect(subject.url).to eq( "/#{@slug}?browse_starts_with=#{@title}&sort=title_asc")
    end
  end
end

describe Search::Presenters::Browse::Titles do
  before(:each) do
    @titles = Search::Presenters::Browse::Titles.new(datastore: "onlinejournals")
  end

  subject do
    described_class.new(datastore: "onlinejournals")
  end

  context "#all" do
    it "returns an array of Title objects" do
      expect(subject.all).to all(be_a(Search::Presenters::Browse::Title))
    end

    it "returns the correct number of titles" do
      expect(subject.all.length).to eq(Search::Presenters::Browse::Titles::BROWSE_STARTS_WITH.length)
    end

    it "returns titles with the correct names and URLs" do
      subject_titles = subject.all
      Search::Presenters::Browse::Titles::BROWSE_STARTS_WITH.each_with_index do |title, index|
        expect(subject_titles[index].title).to eq(title)
        expect(subject_titles[index].url).to eq("/onlinejournals?browse_starts_with=#{title}&sort=title_asc")
      end
    end
  end

  context "#each" do
    it "iterates over the titles" do
      titles = []
      subject.each do |title|
        titles << title
      end

      expect(titles).to eq(subject.all)
    end
  end
end
