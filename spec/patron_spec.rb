require "json"
module Fakes
  class PatronFake < Search::Patron::Base
    include Search::Patron::SessionHelper

    [:affiliation, :email, :sms, :campus, :logged_in?].each do |method|
      define_method method do
        method.to_s
      end
    end
  end
end
RSpec.describe Search::Patron::SessionHelper do
  context "#to_h" do
    it "outputs an appropriate hash" do
      expected = {
        email: "email",
        affiliation: "affiliation",
        campus: "campus",
        logged_in: "logged_in?"
      }
      expect(Fakes::PatronFake.new.to_h).to eq(expected)
    end
  end
end

RSpec.describe Search::Patron do
  before(:each) do
    @data = JSON.parse(fixture("alma_user.json"))
    @session_affiliation = nil
  end
  subject do
    described_class.for(uniqname: "fakeuser", session_affiliation: @session_affiliation)
  end
  context ".for" do
    it "returns an Alma Patron object on a succesful request" do
      stub_alma_get_request(url: "users/fakeuser", output: @data.to_json)
      expect(subject.email).to eq("fakeuser@umich.edu")
      expect(subject.affiliation).to be_nil
    end
    it "passes the existing session affiliation to the Alma Patron" do
      @session_affiliation = "flint"
      stub_alma_get_request(url: "users/fakeuser", output: @data.to_json)
      expect(subject.affiliation).to eq("flint")
    end

    it "returns not logged in patron for non-200 response" do
      stub_alma_get_request(url: "users/fakeuser", status: 500, output: "some output string")
      expect(subject.email).to eq("")
    end
    it "returns not logged in patron for timedout request" do
      stub_alma_get_request(url: "users/fakeuser", no_return: true).to_timeout
      expect(subject.email).to eq("")
    end
  end
end

RSpec.describe Search::Patron::Alma do
  before(:each) do
    @data = JSON.parse(fixture("alma_user.json"))
    @session_affiliation = nil
  end
  subject do
    described_class.new(@data, @session_affiliation)
  end
  context "#email" do
    it "returns the preferred email address from Alma" do
      expect(subject.email).to eq("fakeuser@umich.edu")
    end
    it "returns nil if there is not a preferred email address" do
      @data["contact_info"]["email"][0]["preferred"] = false
      expect(subject.email).to be_nil
    end
  end
  context "#campus" do
    it "returns nil for non-flint campus" do
      expect(subject.campus).to be_nil
    end
    it "returns flint for Flint campus" do
      @data["campus_code"]["value"] = "UMFL"
      expect(subject.campus).to eq("flint")
    end
  end
  context "#logged_in?" do
    it "returns true" do
      expect(subject.logged_in?).to eq(true)
    end
  end
  context "#affiliation" do
    context "session_affiliation is nil" do
      it "returns nil when not flint" do
        expect(subject.affiliation).to be_nil
      end
      it "returns the campus when it is flint " do
        @data["campus_code"]["value"] = "UMFL"
        expect(subject.affiliation).to eq("flint")
      end
    end
    it "returns the session_affiliation if it is not nil" do
      @session_affiliation = "aa"
      @data["campus_code"]["value"] = "UMFL"
      expect(subject.affiliation).to eq("aa")
    end
  end
end

RSpec.describe Search::Patron::FromSession do
  before(:each) do
    @data = {email: "email", logged_in: true, campus: "campus"}
  end
  subject do
    described_class.new(@data)
  end
  context "#email" do
    it "returns what is in the :email field" do
      expect(subject.email).to eq("email")
    end
  end
  context "#campus" do
    it "returns what is in the :campus field" do
      expect(subject.campus).to eq("campus")
    end
  end
  context "#logged_in?" do
    it "returns true when session is true" do
      expect(subject.logged_in?).to eq(true)
    end

    it "returns false when session is false" do
      @data[:logged_in] = false
      expect(subject.logged_in?).to eq(false)
    end
  end
  context "#affiliation" do
    it "returns nil if not in the session" do
      expect(subject.affiliation).to eq(nil)
    end
    it "returns the session value when it is there" do
      @data[:affiliation] = "flint"
      expect(subject.affiliation).to eq("flint")
    end
  end
end

RSpec.describe Search::Patron::NotLoggedIn do
  subject do
    described_class.new
  end
  context "#email" do
    it "returns empty string" do
      expect(subject.email).to eq("")
    end
  end
  context "#campus" do
    it "returns empty string" do
      expect(subject.campus).to eq("")
    end
  end
  context "#logged_in?" do
    it "returns false" do
      expect(subject.logged_in?).to eq(false)
    end
  end
  context "#affiliation" do
    it "returns nil if if not in the IP range" do
      expect(subject.affiliation).to be_nil
    end
    it "returns 'flint' if in the IP range"
  end
end
