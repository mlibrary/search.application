describe Search::ProfilePhotos::Person do
  include_context "uses temp dir"
  before(:each) do
    @specialists_dir = File.join(temp_dir, "specialists")
    FileUtils.mkdir(@specialists_dir)
    @data = JSON.parse(fixture("profile_photos/person.json"))
  end
  let(:remote_photo_path) { "https://example.lib.umich.edu/staff_photos/portrait.jpg" }
  let(:create_local_webp_image) do
    FileUtils.touch(File.join(@specialists_dir, "emcard.webp"))
  end
  subject do
    described_class.new(@data, @specialists_dir)
  end
  context "#uniqname" do
    it "has one" do
      expect(subject.uniqname).to eq("emcard")
    end
  end

  context "#local_image_missing?" do
    it "is true if there is no webpfile in the specialists dir" do
      expect(subject.local_image_missing?).to eq(true)
    end
    it "is false if there is a webpfile right name" do
      create_local_webp_image
      expect(subject.local_image_missing?).to eq(false)
    end
  end

  context "#local_image_out_of_date?" do
    it "is true when the local image is missing" do
      stub_request(:head, remote_photo_path).to_return(headers: {"last-modified" => DateTime.yesterday.httpdate})
      expect(subject.local_image_out_of_date?).to eq(true)
    end
    it "is true when the local image is older than the date in the header of the remote image" do
      create_local_webp_image
      stub_request(:head, "https://example.lib.umich.edu/staff_photos/portrait.jpg").to_return(headers: {"last-modified" => DateTime.tomorrow.httpdate})
      expect(subject.local_image_out_of_date?).to eq(true)
    end
    it "is false whtne the local image is newer than the remote image" do
      create_local_webp_image
      stub_request(:head, "https://example.lib.umich.edu/staff_photos/portrait.jpg").to_return(headers: {"last-modified" => DateTime.yesterday.httpdate})
      expect(subject.local_image_out_of_date?).to eq(false)
    end
  end
  context "#convert" do
    it "converts the source image to jpg and webp with uniqname names of correct dimensions" do
      stub_request(:get, remote_photo_path)
        .to_return(body: File.new(File.join(fixture_path, "profile_photos", "sample.png")), status: 200, headers: {"content-type" => "image/jpeg"})

      subject.convert

      jpg_path = File.join(@specialists_dir, "emcard.jpg")
      webp_path = File.join(@specialists_dir, "emcard.webp")

      expect(File.exist?(jpg_path)).to eq(true)
      expect(File.exist?(webp_path)).to eq(true)
      jpg_file = MiniMagick::Image.open(jpg_path)
      webp_file = MiniMagick::Image.open(webp_path)

      expect(jpg_file.width).to eq(128)
      expect(jpg_file.height).to eq(150)
      expect(jpg_file.type).to eq("JPEG")

      expect(webp_file.width).to eq(128)
      expect(webp_file.height).to eq(150)
      expect(webp_file.type).to eq "WEBP"
    end

    it "handles overwriting an existing photo" do
      stub_request(:get, remote_photo_path)
        .to_return(body: File.new(File.join(fixture_path, "profile_photos", "sample.png")), status: 200, headers: {"content-type" => "image/jpeg"})
      create_local_webp_image
      subject.convert
      webp_file = MiniMagick::Image.open(File.join(@specialists_dir, "emcard.webp"))
      expect(webp_file.size).to be > 0
    end
  end
end
