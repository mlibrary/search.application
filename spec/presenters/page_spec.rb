describe Search::Presenters::Page::List do
  context "#actions" do
    it "does not include the link action" do
      subject = described_class.for(patron: nil, uri: nil).actions
      expect(subject.map { |x| x.uid }).to include("ris")
      expect(subject.map { |x| x.uid }).not_to include("link")
    end
  end

  context "#show_holdings?" do
    it "is false" do
      subject = described_class.for(patron: nil, uri: nil).show_holdings?
      expect(subject).to eq(false)
    end
  end
end

describe Search::Presenters::Page::Results do
  context "#show_holdings?" do
    it "is true" do
      subject = described_class.new(datastore: Search::Datastores.find("catalog"), uri: nil, patron: nil, results: []).show_holdings?
      expect(subject).to eq(true)
    end
  end
  context "#clear_filters_url" do
    it "removes the filters from the link" do
      uri = Addressable::URI.parse("#{S.base_url}/catalog?query=something&filter.availability=Hathi%20Trust&filter.subject=United%20States&page=1")
      subject = described_class.new(datastore: Search::Datastores.find("catalog"), uri: uri, patron: nil, results: [])
      param_keys = Addressable::URI.parse(subject.clear_filters_url).query_hash.keys
      expect(param_keys).to include("query")
      expect(param_keys).to include("page")
      expect(param_keys).not_to include("filter.availability")
      expect(param_keys).not_to include("filter.subject")
    end
  end
end

describe Search::Presenters::Page::Record::Pagination do
  context "#previous_url" do
    it "given position greater than 1, returns url with a position of n-1" do
      uri = Addressable::URI.parse("#{S.base_url}/catalog/record/some_mms_id?query=something&filter.availability=Hathi%20Trust&filter.subject=United%20States&page=1&position=3")
      records = (1..3).map { create(:catalog_record) }
      subject = Addressable::URI.parse(described_class.new(uri: uri, records: records).previous_url)

      expect(subject.query_values["position"]).to eq("2")
      expect(subject.query_values["query"]).to eq("something")
      id = subject.path.split("/").last
      expect(id).to eq(records[0].bib.id)
    end
    it "is nil if the original uri has position 1" do
      uri = Addressable::URI.parse("#{S.base_url}/catalog/record/some_mms_id?query=something&filter.availability=Hathi%20Trust&filter.subject=United%20States&page=1&position=1")
      records = (1..3).map { create(:catalog_record) }
      subject = described_class.new(uri: uri, records: records).previous_url
      expect(subject).to be_nil
    end
  end
  context "#next_url" do
    it "returns a position n+1 when there are three catalog records" do
      uri = Addressable::URI.parse("#{S.base_url}/catalog/record/some_mms_id?query=something&filter.availability=Hathi%20Trust&filter.subject=United%20States&page=1&position=5")
      records = (1..3).map { create(:catalog_record) }
      subject = Addressable::URI.parse(described_class.new(uri: uri, records: records).next_url)

      expect(subject.query_values["position"]).to eq("6")
      expect(subject.query_values["query"]).to eq("something")
      id = subject.path.split("/").last
      expect(id).to eq(records[2].bib.id)
    end
    it "is nil if the record has a nil 3rd record" do
      uri = Addressable::URI.parse("#{S.base_url}/catalog/record/some_mms_id?query=something&filter.availability=Hathi%20Trust&filter.subject=United%20States&page=1&position=1")
      records = (1..2).map { create(:catalog_record) }
      subject = described_class.new(uri: uri, records: records).next_url
      expect(subject).to be_nil
    end
  end
  context ".for" do
    context "no position query param" do
      it "returns Empty pagination" do
        uri = Addressable::URI.parse("#{S.base_url}/catalog/record/some_mms_id?query=title:(test)&&filters=library:aa&ht_search_only=false&sort=relevance")
        subject = described_class.for(uri: uri)
        expect(subject.class.name).to include("Empty")
      end
    end
    context "middle item" do
      before(:each) do
        @uri = Addressable::URI.parse("#{S.base_url}/catalog/record/some_mms_id?query=title:(test)&&filters=library:aa&ht_search_only=false&sort=relevance&position=6")
        @results = create(:catalog_api_one_result)
        @results["records"].push(create(:catalog_api_record, fields: [:id]))
        @results["records"].push(create(:catalog_api_record, fields: [:id]))
      end
      it "returns valid pagination when given an in the middle item" do
        @results["records"][1]["id"] = "some_mms_id"

        stub_request(:get, "#{S.catalog_api_url}/catalog/search?offset=4&limit=3&query=title:(test)&&filters=library:aa&ht_search_only=false&sort=relevance")
          .to_return(status: 200, body: @results.to_json, headers: {content_type: "application/json"})
        subject = described_class.for(uri: @uri)
        expect(subject.next_url).not_to be_nil
        expect(subject.previous_url).not_to be_nil
      end
      it "returns Empty pagination when the mms_id isn't in the results" do
        stub_request(:get, "#{S.catalog_api_url}/catalog/search?offset=4&limit=3&query=title:(test)&&filters=library:aa&ht_search_only=false&sort=relevance")
          .to_return(status: 200, body: @results.to_json, headers: {content_type: "application/json"})
        subject = described_class.for(uri: @uri)
        expect(subject.class.name).to include("Empty")
      end
    end
    context "#first item" do
      before(:each) do
        @uri = Addressable::URI.parse("#{S.base_url}/catalog/record/some_mms_id?query=title:(test)&&filters=library:aa&ht_search_only=false&sort=relevance&position=1")
        @results = create(:catalog_api_one_result)
        @results["records"].push(create(:catalog_api_record, fields: [:id]))
      end
      it "returns valid pagination" do
        @results["records"][0]["id"] = "some_mms_id"

        stub_request(:get, "#{S.catalog_api_url}/catalog/search?offset=0&limit=2&query=title:(test)&&filters=library:aa&ht_search_only=false&sort=relevance")
          .to_return(status: 200, body: @results.to_json, headers: {content_type: "application/json"})
        subject = described_class.for(uri: @uri)
        expect(subject.next_url).not_to be_nil
        expect(subject.previous_url).to be_nil
      end
      it "returns Empty pagination if solr doesn't return matching mms_id" do
        stub_request(:get, "#{S.catalog_api_url}/catalog/search?offset=0&limit=2&query=title:(test)&&filters=library:aa&ht_search_only=false&sort=relevance")
          .to_return(status: 200, body: @results.to_json, headers: {content_type: "application/json"})
        subject = described_class.for(uri: @uri)
        expect(subject.class.name).to include("Empty")
      end
      it "returns Empty pagination if solr returns only one item" do
        @results["records"][0]["id"] = "some_mms_id"
        @results["records"].pop
        stub_request(:get, "#{S.catalog_api_url}/catalog/search?offset=0&limit=2&query=title:(test)&&filters=library:aa&ht_search_only=false&sort=relevance")
          .to_return(status: 200, body: @results.to_json, headers: {content_type: "application/json"})
        subject = described_class.for(uri: @uri)
        expect(subject.class.name).to include("Empty")
      end
    end
  end
end
