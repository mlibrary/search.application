RSpec.describe "sms and email requests" do
  include Mail::Matchers

  before(:each) do
    @session = {
      email: "emcard@umich.edu",
      sms: "sms",
      logged_in: false,
      expires_at: (Time.now + 1.hour).to_i,
      campus: nil
    }
    Mail::TestMailer.deliveries.clear
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

  # context "POST /catalog/record/:id/sms accept json" do
  # it "returns an error for a not logged in user" do
  # env "rack.session", @session
  # post "/catalog/record/some_id/sms", {phone: "999-999-9999"}, {"HTTP_ACCEPT" => "application/json"}
  # body = JSON.parse(last_response.body)
  # expect(body["code"]).to eq(403)
  # expect(body["message"]).to eq("User must be logged in")
  # end
  # it "returns success message when successful" do
  # @session[:logged_in] = true
  # env "rack.session", @session
  # stub_catalog_record_request

  # post "/catalog/record/some_id/sms", {phone: "999-999-9999"}, {"HTTP_ACCEPT" => "application/json"}

  # body = JSON.parse(last_response.body)
  # expect(body["code"]).to eq(202)
  # expect(body["message"]).to eq("SMS message has been sent")
  # end

  # it "returns error message when twilio client raises an error" do
  # @session[:logged_in] = true
  # env "rack.session", @session
  # stub_catalog_record_request

  # post "/catalog/record/some_id/sms", {phone: "bad_number"}, {"HTTP_ACCEPT" => "application/json"}

  # body = JSON.parse(last_response.body)
  # expect(body["code"]).to eq(400)
  # expect(body["message"]).to eq("Something went wrong")
  # end
  # end
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

      post "/catalog/record/some_id/sms", {phone: "bad_number"}
      follow_redirect!

      expect(last_response.body).to include("Something went wrong")
    end
  end
  context "POST /catalog/record/:id/email" do
    it "returns an error for a not logged in user" do
      env "rack.session", @session
      stub_full_record_page_request

      get "/catalog/record/some_id"
      post "/catalog/record/some_id/email", {email: "someone@umich.edu"}
      follow_redirect!

      expect(last_response.body).to include("User must be logged in")
      is_expected.not_to have_sent_email
    end
    it "returns success message when successful" do
      @session[:logged_in] = true
      env "rack.session", @session
      stub_full_record_page_request

      expect(Search::Email::Catalog::Worker.jobs.size).to eq(0)
      post "/catalog/record/some_id/email", {email: "someone@umich.edu"}
      follow_redirect!
      expect(last_response.body).to include("Email message has been sent")
      expect(Search::Email::Catalog::Worker.jobs.size).to eq(1)
    end

    it "returns error message when invalid email is given" do
      @session[:logged_in] = true
      env "rack.session", @session
      stub_full_record_page_request

      allow_any_instance_of(Mail::TestMailer).to receive("deliver!").and_raise(StandardError, "some message")
      post "/catalog/record/some_id/email", {email: "invalid email address"}
      follow_redirect!

      expect(last_response.body).to include("Your email address is probably wrong")
      expect(Search::Email::Catalog::Worker.jobs.size).to eq(0)
    end
  end
end
