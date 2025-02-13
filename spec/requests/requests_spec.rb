RSpec.describe "requests" do
  context "session setting" do
    before(:each) do
      @session = {
        email: "email",
        sms: "sms",
        logged_in: true,
        expires_at: (Time.now + 1.hour).to_i,
        campus: "aa",
        affiliation: "aa"
      }
    end
    let(:get_static_page) {
      env "rack.session", @session
      get "/accessibility"
    }
    it "sets the session to NotLoggedIn user when it's a new user" do
      @session = {}
      get_static_page
      expect(last_request.session[:logged_in]).to eq(false)
      expect(last_request.session[:expires_at]).to be_nil
    end
    it "does not touch the session of unexpired logged in user" do
      get_static_page
      expect(last_request.session[:logged_in]).to eq(true)
      expect(last_request.session[:expires_at]).not_to be_nil
    end
    it "does not touch the session of a not logged in user who has had a session" do
      @session.delete(:expires_at)
      @session[:logged_in] = false
      get_static_page
      expect(last_request.session[:affiliation]).to eq("aa")
      expect(last_request.session[:expires_at]).to be_nil
    end
    it "sets the session to NotLoggedIn for an expired logged in user" do
      @session[:expires_at] = (Time.now - 1.hour).to_i
      get_static_page
      expect(last_request.session[:logged_in]).to eq(false)
      expect(last_request.session[:expires_at]).to be_nil
    end
  end
  context "/" do
    it "redirects to /everything" do
      get "/"
      expect(last_response.status).to eq(302)
      # TODO: this is too fuzzy a test
      expect(last_response.location).to include("everything")
    end
  end
  context "/everything" do
    it "has a title and icons" do
      get "/everything"
      expect(last_response.body).to include("Everything")
      expect(last_response.body).to include("open_in_new")
    end
  end
end
