RSpec.describe Search::Models::Specialists do
  let(:data) { JSON.parse(fixture("results/specialists.json")) }

  it "has specialists" do
    specialist = described_class.new(data).first
    expect(specialist.name).to eq("So and So")
    expect(specialist.title).to eq("Bird specialist")
    expect(specialist.phone).to eq("999-999-9999")
    expect(specialist.uniqname).to eq("soandso")
    expect(specialist.email).to eq("soandso@umich.edu")
    expect(specialist.image_url).to eq("images/specialists/soandso.webp")
  end

  it "can get specialists for the catalog" do
    uri = Addressable::URI.parse("#{S.base_url}/catalog?query=whatever")
    stub_request(:get, "#{S.catalog_api_url}/catalog/specialists?&query=whatever&filters=library:aa&ht_search_only=false")
      .to_return(status: 200, body: data.to_json, headers: {content_type: "application/json"})

    specialists = described_class.for_catalog(uri)
    expect(specialists.first.name).to eq("So and So")
  end
end
