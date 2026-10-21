RSpec.describe Search::Library do
  before(:each) do
    @id = "flint"
    @name = "Flint Thompson Library"
  end

  let(:default_library) { "U-M Ann Arbor Libraries" }
  let(:set_default_library) {
    @name = default_library
    @id = "aa"
  }

  subject do
    described_class.new(id: @id, name: @name)
  end

  context "#active_class" do
    it "will return a css class if the `library` query params matches the library name" do
      expect(subject.active_class(param: @name)).to eq("button__ghost--active")
    end
    it "will return a css class if the `library` query params matches a library id" do
      expect(subject.active_class(param: @id)).to eq("button__ghost--active")
    end
    it "will not return a class if the `library` query params does not match the library nor does the campus" do
      expect(subject.active_class(param: "not a real library")).to be_nil
    end
    context "when library param is nil" do
      context "when campus is aa" do
        it "will return a class for the default library" do
          set_default_library
          expect(subject.active_class(param: nil, campus: "aa")).to eq("button__ghost--active")
        end
        it "will return nil for anything else" do
          expect(subject.active_class(param: nil, campus: "aa")).to be_nil
        end
      end
      context "when campus is flint" do
        it "will return a class for the Flint library when the campus is flint" do
          expect(subject.active_class(param: nil, campus: "flint")).to eq("button__ghost--active")
        end
        it "will not return a css class for the default library" do
          set_default_library
          expect(subject.active_class(param: nil, campus: "flint")).to be_nil
        end
      end
    end
  end

  context "#slug" do
    it "slug is the id" do
      expect(subject.slug).to eq("flint")
    end
  end

  context "#to_s" do
    it "returns as a string" do
      expect(subject.to_s).to eq(@name)
    end
  end
end

RSpec.describe Search::Libraries do
  let(:library) { "All libraries" }

  context "#all" do
    it "lists all libraries in the config file" do
      expect(described_class.all.first.to_s).to eq(library)
    end
  end

  context "#each" do
    it "loops through each library" do
      libraries = []
      described_class.each do |library|
        libraries << library.to_s
      end

      expect(libraries).to eq(["All libraries", "U-M Ann Arbor Libraries", "Flint Thompson Library", "Bentley Historical Library", "William L. Clements Library"])
    end
  end

  context "#default" do
    it "returns the default library" do
      expect(described_class.default.to_s).to eq("U-M Ann Arbor Libraries")
    end
  end
end
