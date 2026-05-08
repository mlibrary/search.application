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
  let(:tmp_dir_path) { File.join(temp_dir, "tmp") }
  let(:create_tmp_dir) do
    FileUtils.mkdir(tmp_dir_path)
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
  context "#pull(dir)" do
    it "requests a download of the file to temp directory named with file extension based on content-type jpeg" do
      create_tmp_dir

      stub_request(:get, remote_photo_path)
        .to_return(body: File.new(File.join(fixture_path, "profile_photos", "tiny.png")), status: 200, headers: {"content-type" => "image/jpeg"})

      file_name = subject.pull(tmp_dir_path)

      expect(File.exist?(File.join(tmp_dir_path, "source.jpg"))).to eq(true)
      expect(file_name).to eq("source.jpg")
    end
    it "requests a download of the file to temp directory named with file extension based on content-type png" do
      create_tmp_dir

      stub_request(:get, remote_photo_path)
        .to_return(body: File.new(File.join(fixture_path, "profile_photos", "tiny.png")), status: 200, headers: {"content-type" => "image/png"})

      file_name = subject.pull(tmp_dir_path)

      expect(File.exist?(File.join(tmp_dir_path, "source.png"))).to eq(true)
      expect(file_name).to eq("source.png")
    end
  end
  context "#convert" do
  end
  context "#move" do
    it "moves the webp and jpg images to the specialists directory" do
      create_tmp_dir
      FileUtils.touch(File.join(tmp_dir_path, "emcard.jpg"))
      FileUtils.touch(File.join(tmp_dir_path, "emcard.webp"))
      subject.move(tmp_dir_path)
      expect(File.exist?(File.join(@specialists_dir, "emcard.jpg"))).to eq(true)
      expect(File.exist?(File.join(@specialists_dir, "emcard.webp"))).to eq(true)
    end
  end
end
