describe Search::Email::Catalog do
  before(:each) do
    Mail::TestMailer.deliveries.clear
  end

  it "sends an email?" do
    bib_id = "9912345"
    data = create(:catalog_api_record, fields: [:title, :citation, :holdings])
    stub_request(:get, "#{S.catalog_api_url}/records/#{bib_id}")
      .to_return(status: 200, body: data.to_json, headers: {content_type: "application/json"})
    # stub_request(:get, "#{S.catalog_browse_url}/carousel?query=#{call_number}")
    # .to_return(status: 200, body: [], headers: {})

    described_class.new(bib_id).send(to: "someone@default.invalid")
    expect(Mail::TestMailer.deliveries.first.text_part.body.to_s).to include("Michigan")
    expect(Mail::TestMailer.deliveries.first.html_part.body.to_s).to include("Michigan")
  end
end
