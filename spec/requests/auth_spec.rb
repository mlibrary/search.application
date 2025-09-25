RSpec.describe "authentication requests" do
  include Rack::Test::Methods

  let(:omniauth_auth) {
    {
      info: {nickname: "fakeuser"},
      credentials: {expires_in: 86399}
    }
  }
  before(:each) do
    @data = JSON.parse(fixture("alma_user.json"))
    @session = {
      email: "email",
      sms: "sms",
      logged_in: false,
      expires_at: (Time.now - 1.hour).to_i,
      campus: "flint",
      affiliation: "flint",
      path_before_form: "http://example.com/accessibility?something=other"
    }
    OmniAuth.config.add_mock(:openid_connect, omniauth_auth)
    env "rack.session", @session
  end
  context "/auth/openid_connect/callback" do
    it "sets the session correctly for user in alma" do
      stub_alma_get_request(url: "users/fakeuser", output: @data.to_json)
      get "/auth/openid_connect/callback"
      session = last_request.session
      expect(session[:expires_at]).to be > Time.now.to_i
      expect(session[:logged_in]).to eq(true)
      expect(session[:email]).to eq("fakeuser@umich.edu")
      expect(session[:campus]).to be_nil
      expect(session[:affiliation]).to eq("flint")
      expect(last_response.status).to eq(302)
      expect(last_response.location).to eq(@session[:path_before_form])
    end
    it "handles user not found in alma"
  end
  context "/logout" do
    it "clears the session and redirects to weblogin" do
      get "/logout"
      expect(last_request.session[:email]).to be_nil
      expect(last_response.status).to eq(302)
      expect(last_response.location).to include("shibboleth")
    end
  end
end
