RSpec.describe "text and email requests" do
  before(:each) do
    @session = {
      email: "emcard@umich.edu",
      # sms: "sms",
      logged_in: false,
      expires_at: (Time.now + 1.hour).to_i,
      campus: nil
    }
  end
  let(:body) { JSON.parse(last_response.body) }

  context "POST /catalog/record/:id/text accept json" do
    it "returns an error for a not logged in user" do
      env "rack.session", @session
      post "/catalog/record/some_id/text", {phone: "999-999-9999"}, {"HTTP_ACCEPT" => "application/json"}
      expect(body["code"]).to eq(403)
      expect(body["message"]).to eq("User must be logged in")
    end

    it "returns success message when successful" do
      @session[:logged_in] = true
      env "rack.session", @session

      expect(Search::Actions::Text::Worker.jobs.size).to eq(0)

      post "/catalog/record/some_id/text", {phone: "999-999-9999"}, {"HTTP_ACCEPT" => "application/json"}

      expect(Search::Actions::Text::Worker.jobs.size).to eq(1)
      expect(body["code"]).to eq(202)
      expect(body["message"]).to eq("We are sending your text message")
    end
  end

  context "POST /catalog/record/:id/email" do
    it "returns an error for a not logged in user" do
      env "rack.session", @session

      expect(Search::Actions::Email::Catalog::Worker.jobs.size).to eq(0)
      post "/catalog/record/some_id/email", {email: "someone@umich.edu"}
      expect(body["code"]).to eq(403)
      expect(body["message"]).to eq("User must be logged in")
      expect(Search::Actions::Email::Catalog::Worker.jobs.size).to eq(0)
    end

    it "returns success message when successful" do
      @session[:logged_in] = true
      env "rack.session", @session
      expect(Search::Actions::Email::Catalog::Worker.jobs.size).to eq(0)

      post "/catalog/record/some_id/email", {email: "someone@umich.edu"}
      expect(body["code"]).to eq(202)
      expect(body["message"]).to eq("We are sending your email")
      expect(Search::Actions::Email::Catalog::Worker.jobs.size).to eq(1)
    end

    it "returns error message when invalid email is given" do
      @session[:logged_in] = true
      env "rack.session", @session

      expect(Search::Actions::Email::Catalog::Worker.jobs.size).to eq(0)

      post "/catalog/record/some_id/email", {email: "Something went wrong"}

      expect(body["code"]).to eq(500)
      expect(body["message"]).to eq("Something went wrong")
      expect(Search::Actions::Email::Catalog::Worker.jobs.size).to eq(0)
    end
  end
end
