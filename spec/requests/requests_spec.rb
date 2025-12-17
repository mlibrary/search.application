RSpec.describe "requests" do
  before(:each) do
    @session = {
      email: "email",
      sms: "sms",
      logged_in: false,
      expires_at: (Time.now + 1.hour).to_i,
      campus: nil
    }
    @params = {
      search_datastore: "everything",
      search_option: "keyword",
      search_text: ""
    }
  end
  let(:get_static_page) {
    env "rack.session", @session
    get "/accessibility?something=other"
  }
  context "session setting" do
    context "Logged in User" do
      it "does not touch the session when unexpired" do
        @session[:logged_in] = true
        get_static_page
        expect(last_request.session[:logged_in]).to eq(true)
        expect(last_request.session[:expires_at]).not_to be_nil
      end
    end
    context "Not Logged In User" do
      it "sets the session correctly for a new user" do
        @session = {}
        get_static_page
        expect(last_request.session[:logged_in]).to eq(false)
        expect(last_request.session[:expires_at]).not_to be_nil
        expect(last_request.session[:affiliation]).to be_nil
        expect(last_request.session[:path_before_form]).to include("/accessibility?something=other")
      end
      it "does not change the affiliation when unexpired" do
        @session[:affiliation] = "flint"
        get_static_page
        expect(last_request.session[:expires_at]).not_to be_nil
        expect(last_request.session[:affiliation]).to eq("flint")
        expect(last_request.session[:path_before_form]).to include("/accessibility?something=other")
      end
      it "resets the affiliation when expired" do
        @session[:affiliation] = "flint"
        @session[:expires_at] = (Time.now - 1.hour).to_i
        get_static_page
        expect(last_request.session[:expires_at]).not_to be_nil
        expect(last_request.session[:affiliation]).to be_nil
        expect(last_request.session[:path_before_form]).to include("/accessibility?something=other")
      end
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
  context "404" do
    it "is successfull and says not found" do
      get "/this-page-does-not-exist"
      expect(last_response.status).to eq(404)
      expect(last_response.body).to include("Page not found")
    end
  end
  context "post /change-affiliation" do
    context "has nil affiliation in sesssion" do
      it "sets session affiliation to flint and redirects to the last visited page" do
        get_static_page
        post "/change-affiliation"
        expect(last_request.session[:affiliation]).to eq("flint")
        expect(last_response.location).to include("accessibility")
      end
    end
    context "has flint affiliation in sesssion" do
      it "sets session affiliation to nil and redirects to the last visited page" do
        @session[:affiliation] = "flint"
        get_static_page
        post "/change-affiliation"
        expect(last_request.session[:affiliation]).to be_nil
        expect(last_response.location).to include("accessibility")
      end
    end
  end
  context "post /search" do
    context "searching with `keyword` selected" do
      it "redirects to the default datastore landing page" do
        get_static_page
        post "/search", @params
        expect(last_response.location).to end_with("/everything")
      end
      it "redirects to the current datastore's landing page" do
        get "/catalog?query=title:(test)"
        post "/search", @params.merge(search_datastore: "catalog")
        expect(last_response.location).to end_with("/catalog")
      end
      it "redirects to `search.lib.umich.edu` with the query not wrapped" do
        search_text = "search text"
        search_datastore = "catalog"
        get "/#{search_datastore}"
        post "/search", @params.merge(search_text: search_text, search_datastore: search_datastore)
        location = last_response.location
        uri = URI.parse(location)
        query_params = URI.decode_www_form(uri.query).to_h
        expect(location).to start_with("https://search.lib.umich.edu/#{search_datastore}")
        expect(query_params["query"]).to eq(search_text)
      end
    end
    context "searching with a different option selected" do
      it "redirects to `search.lib.umich.edu` with the query wrapped" do
        search_option = "title"
        get "/articles"
        post "/search", @params.merge(search_option: search_option)
        location = last_response.location
        uri = URI.parse(location)
        query_params = URI.decode_www_form(uri.query).to_h
        expect(query_params["query"]).to start_with("#{search_option}:(")
        expect(query_params["query"]).to end_with(")")
      end
    end
  end
  context "/articles" do
    before(:each) do
      @session = {
        email: nil,
        logged_in: false,
        expires_at: (Time.now + 1.hour).to_i,
        campus: "flint",
        affiliation: nil
      }
    end
    context "flint messages" do
      it "shows the flint message for someone with a flint campus" do
        env "rack.session", @session
        get "/articles"
        expect(last_response.body).to match(/For\s*the\s*best\s*results/)
      end
      it "does not show the message for someone not with flint campus" do
        @session[:campus] = nil
        env "rack.session", @session
        get "/articles"
        expect(last_response.body).not_to match(/For\s*the\s*best\s*results/)
      end
    end
  end
  context "/catalog/record/:id" do
    it "shows the catalog record page" do
      bib_id = "9912345"
      data = create(:catalog_api_record)
      call_number = data["call_number"][0]["text"]
      stub_request(:get, "#{S.catalog_api_url}/records/#{bib_id}")
        .to_return(status: 200, body: data.to_json, headers: {content_type: "application/json"})
      stub_request(:get, "#{S.catalog_browse_url}/carousel?query=#{call_number}")
        .to_return(status: 200, body: [], headers: {})
      get "/catalog/record/#{bib_id}"
      expect(last_response.status).to eq(200)
      expect(last_response.body).to include(data["title"][0]["original"]["text"])
      expect(last_response.body).to include("/catalog/record/#{bib_id}/ris")
    end
  end
  context "/catalog/record/:bib_id/ris" do
    it "returns an ris file" do
      citation = {
        "citation" => {
          "tagged" => [
            {
              "content" => "MUSIC",
              "ris" => [
                "TY"
              ],
              "meta" => []
            },
            {
              "content" => "Some Author Name",
              "ris" => [
                "AU"
              ],
              "meta" => ["author"]
            },
            {
              "content" => "",
              "ris" => [
                "ER"
              ],
              "meta" => []
            }
          ],
          "csl" => {
            "id" => "99mms_id",
            "type" => "book",
            "title" => "The title of the book"
          }
        }
      }
      data = create(:catalog_api_record)
      bib_id = data["id"]
      data["citation"] = citation["citation"]
      stub_request(:get, "#{S.catalog_api_url}/records/#{bib_id}")
        .to_return(status: 200, body: data.to_json, headers: {content_type: "application/json"})
      get "/catalog/record/#{bib_id}/ris"
      expect(last_response.headers["Content-Type"]).to eq("application/x-research-info-systems")
      expect(last_response.headers["Content-Disposition"]).to include("#{bib_id}.ris")
    end
    it "redirects to past activity when there is network timeout" do
      bib_id = "9912345"
      stub_request(:get, "#{S.catalog_api_url}/records/#{bib_id}")
        .to_timeout
      get "/catalog/record/#{bib_id}/ris"
      expect(last_response.status).to eq(302)
    end
  end
end
