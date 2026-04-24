RSpec.describe Search::Presenters::Actions::Action::Citation do
  before(:each) do
    @results = [
      OpenStruct.new(csl: "CSL Citation 1", ris: "RIS Citation 1"),
      OpenStruct.new(csl: "CSL Citation 2", ris: "RIS Citation 2"),
      OpenStruct.new(csl: "CSL Citation 3", ris: "RIS Citation 3")
    ]
  end

  subject do
    described_class.new(@results)
  end

  context "#csl" do
    it "returns an array of CSL citations" do
      expect(subject.csl).to eq(@results.map { |record| record.csl })
    end

    it "returns an empty array if there are no results" do
      empty_subject = described_class.new([])
      expect(empty_subject.csl).to eq([])
    end
  end

  context "#ris" do
    it "returns an array of RIS citations" do
      expect(subject.ris).to eq(@results.map { |record| record.ris })
    end

    it "returns an empty array if there are no results" do
      empty_subject = described_class.new([])
      expect(empty_subject.ris).to eq([])
    end
  end
end
