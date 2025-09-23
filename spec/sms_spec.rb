describe Search::SMS::Catalog do
  before(:each) do
    @record = create(:catalog_record)
    @bib = Search::Models::Record::Catalog::Bib.new(create(:catalog_api_record))
  end

  subject do
    allow(@record).to receive(:bib).and_return(@bib)
    described_class.new(@record)
  end
  context "#message" do
    it "returns an appropriate for a single physical holding item" do
      expected = <<~TXT.strip
        Title: #{@bib.title.original.text}
        Location: #{@record.holdings.physical.list.first.physical_location.text}
        Call Number: #{@record.holdings.physical.list.first.call_number}
        Catalog Record: #{S.base_url}/catalog/record/#{@bib.id}
      TXT
      expect(subject.message).to eq expected
    end
    it "returns a message without Location and Call Number when there are no physical holdings" do
      @record.holdings.physical.list.pop
      expected = <<~TXT.strip
        Title: #{@bib.title.original.text}
        Link: #{S.base_url}/catalog/record/#{@bib.id}
      TXT
      expect(subject.message).to eq expected
    end
    it "returns a message without Location and Call number and note about multiple items when there are more there is more than one holding" do
      @record.holdings.physical.list.push(create(:physical_holding))
      expected = <<~TXT.strip
        Title: #{@bib.title.original.text}
        There are multiple items available; see the catalog record for a list: #{S.base_url}/catalog/record/#{@bib.id}
      TXT
      expect(subject.message).to eq expected
    end
  end
end
