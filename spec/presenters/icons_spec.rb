RSpec.describe Search::Presenters::Icons do
  context "#template_icons" do
    it "lists icons in the config file" do
      expect(described_class.new.template_icons).to include("open_in_new")
    end
  end
  context "#all" do
    it "lists config file icons and initialize icons" do
      icons = described_class.new(["zz"])
      expect(icons.all).to include("open_in_new")
      expect(icons.all).to include("zz")
    end
    it "has the icons sorted alphabetically" do
      icons = described_class.new(["zzz", "aaa"])
      expect(icons.all.first).to eq("aaa")
      expect(icons.all.last).to eq("zzz")
    end
    it "has unique icons" do
      icons = described_class.new(["book", "book"])
      expect(icons.all.tally["book"]).to eq(1)
    end
  end
  context "#to_s" do
    it "returns the icons as a comma separated string" do
      icons = described_class.new(["aaa", "zzz"])
      icons_str = icons.to_s
      icons_array = icons_str.split(",")
      expect(icons_array.first).to eq("aaa")
      expect(icons_array).to include("open_in_new")
      expect(icons_array.last).to eq("zzz")
    end
  end
end
