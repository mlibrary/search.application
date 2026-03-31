RSpec.describe Search::Presenters::Actions::Action do
  before(:each) do
    @uid = "email"
    @text = "Email"
  end

  subject do
    described_class.new(uid: @uid, text: @text)
  end

  context "#to_s" do
    it "returns the text of the action" do
      expect(subject.to_s).to eq(@text)
    end
  end
end
