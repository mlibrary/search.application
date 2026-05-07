describe Search::ProfilePhotos::Person do
  include_context "uses temp dir"
  before(:each) do
    @specialists_dir = File.join(temp_dir, "specialists")
    FileUtils.mkdir(@specialists_dir)
    @data = JSON.parse(fixture("profile_photos/person.json"))
  end
  subject do
    described_class.new(@data, @specialists_dir)
  end
  context "#uniqname" do
    it "has one" do
      expect(subject.uniqname).to eq("emcard")
    end
  end

  context "#webp_filename" do
    it "is the uniqname with ending webp" do
      expect(subject.webp_filename).to eq("emcard.webp")
    end
  end

  context "#local_image_missing?" do
    it "is true if there is no webpfile in the specialists dir" do
      expect(subject.local_image_missing?).to eq(true)
    end
    it "is false if there is a webpfile right name" do
      FileUtils.mkdir(File.join(@specialists_dir, "emcard.webp"))
      expect(subject.local_image_missing?).to eq(false)
    end
  end
end
