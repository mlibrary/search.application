RSpec.describe Search::Presenters::Actions do
  before(:each) do
    @exclude = ["link"]
  end

  subject do
    described_class.new(@exclude)
  end

  context "#each" do
    it "iterates over the actions with the body" do
      actions = []
      subject.each do |action|
        actions << action.uid
      end

      expect(actions).to eq(["email", "text", "citation", "ris", "toggle-selected"])
    end
  end
end
