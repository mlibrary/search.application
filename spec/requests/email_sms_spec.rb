RSpec.describe "sms and email requests" do
  before(:each) do
    @session = {
      email: "email",
      sms: "sms",
      logged_in: false,
      expires_at: (Time.now + 1.hour).to_i,
      campus: nil
    }
  end
  let(:catalog_api_record) { create(:catalog_api_record) }
  let(:stub_catalog_record_request) do
    stub_request(:get, "#{S.catalog_api_url}/records/some_id")
      .to_return(status: 200, body: catalog_api_record.to_json, headers: {content_type: "application/json"})
  end

  let(:stub_full_record_page_request) do
    stub_catalog_record_request
    call_number = catalog_api_record["call_number"][0]["text"]
    stub_request(:get, "#{S.catalog_browse_url}/carousel?query=#{call_number}")
      .to_return(status: 200, body: [], headers: {})
  end

  context "POST /catalog/record/:id/sms accept json" do
    it "returns an error for a not logged in user" do
      env "rack.session", @session
      post "/catalog/record/some_id/sms", {phone: "999-999-9999"}, {"HTTP_ACCEPT" => "application/json"}
      body = JSON.parse(last_response.body)
      expect(body["code"]).to eq(403)
      expect(body["error_message"]).to eq("User must be logged in")
    end
    it "returns success message when successful" do
      @session[:logged_in] = true
      env "rack.session", @session
      stub_catalog_record_request

      post "/catalog/record/some_id/sms", {phone: "999-999-9999"}, {"HTTP_ACCEPT" => "application/json"}

      body = JSON.parse(last_response.body)
      expect(body["code"]).to eq(202)
      expect(body["message"]).to eq("SMS message has been sent")
    end

    it "returns error message when twilio client raises an error" do
      @session[:logged_in] = true
      env "rack.session", @session
      stub_catalog_record_request

      post "/catalog/record/some_id/sms", {phone: "bad_number"}, {"HTTP_ACCEPT" => "application/json"}

      body = JSON.parse(last_response.body)
      expect(body["code"]).to eq(400)
      expect(body["message"]).to eq("Something went wrong")
    end
  end
  context "POST /catalog/record/:id/sms accept html" do
    it "returns an error for a not logged in user" do
      env "rack.session", @session
      stub_full_record_page_request

      get "/catalog/record/some_id"
      post "/catalog/record/some_id/sms", {phone: "999-999-9999"}
      follow_redirect!

      expect(last_response.body).to include("User must be logged in")
    end
    it "returns success message when successful" do
      @session[:logged_in] = true
      env "rack.session", @session
      stub_full_record_page_request

      post "/catalog/record/some_id/sms", {phone: "999-999-9999"}
      follow_redirect!

      expect(last_response.body).to include("SMS message has been sent")
    end

    it "returns error message when twilio client raises an error" do
      @session[:logged_in] = true
      env "rack.session", @session
      stub_full_record_page_request

      post "/catalog/record/some_id/sms", {phone: "bad_number"}, {"http_accept" => "application/json"}
      follow_redirect!

      expect(last_response.body).to include("Something went wrong")
    end
  end
end
