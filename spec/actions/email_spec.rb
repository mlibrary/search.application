describe Search::Actions::Email::Worker::Record do
  before(:each) do
    Mail::TestMailer.deliveries.clear
  end

  it "sends an email" do
    api_resp_body = create(:catalog_api_record, fields: [:id, :title, :citation, :holdings])
    bib_id = api_resp_body["id"]
    title = api_resp_body["title"][0]["original"]["text"]

    data = {
      catalog: [bib_id]
    }

    stub_request(:get, "#{S.catalog_api_url}/records/#{bib_id}")
      .to_return(status: 200, body: api_resp_body.to_json, headers: {content_type: "application/json"})

    described_class.new.perform("from@default.invalid", "to@default.invalid", data)

    first_delivery = Mail::TestMailer.deliveries.first
    expect(first_delivery.to).to contain_exactly "to@default.invalid"
    expect(first_delivery.from).to contain_exactly "from@default.invalid"
    expect(first_delivery.text_part.body.to_s).to include(title)
    expect(first_delivery.html_part.body.to_s).to include(title)
    expect(first_delivery.html_part.body.to_s).not_to include("My Temporary List")
  end
end
describe Search::Actions::Email::Worker::List do
  before(:each) do
    Mail::TestMailer.deliveries.clear
  end

  it "sends an email" do
    api_resp_body = create(:catalog_api_record, fields: [:id, :title, :citation, :holdings])
    bib_id = api_resp_body["id"]
    title = api_resp_body["title"][0]["original"]["text"]

    data = {
      catalog: [bib_id]
    }

    stub_request(:get, "#{S.catalog_api_url}/records/#{bib_id}")
      .to_return(status: 200, body: api_resp_body.to_json, headers: {content_type: "application/json"})

    described_class.new.perform("from@default.invalid", "to@default.invalid", data)

    first_delivery = Mail::TestMailer.deliveries.first
    expect(first_delivery.to).to contain_exactly "to@default.invalid"
    expect(first_delivery.from).to contain_exactly "from@default.invalid"
    expect(first_delivery.text_part.body.to_s).to include(title)
    expect(first_delivery.html_part.body.to_s).to include(title)
    expect(first_delivery.html_part.body.to_s).to include("My Temporary List")
  end
end
