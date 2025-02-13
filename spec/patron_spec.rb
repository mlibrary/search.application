require "json"
module Fakes
  class PatronFake < Search::Patron::Base
    include Search::Patron::SessionHelper
    [:email, :sms, :campus, :logged_in?].each do |method|
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
        sms: "sms",
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
  end
  context ".for" do
    it "returns an Alma Patron object on a succesful request" do
      stub_alma_get_request(url: "users/fakeuser", output: @data.to_json)
      patron = described_class.for("fakeuser")
      expect(patron.email).to eq("fakeuser@umich.edu")
    end

    it "returns not logged in patron for non-200 response" do
      stub_alma_get_request(url: "users/fakeuser", status: 500, output: "some output string")
      patron = described_class.for("fakeuser")
      expect(patron.email).to eq("")
    end
    it "returns not logged in patron for timedout request" do
      stub_alma_get_request(url: "users/fakeuser", no_return: true).to_timeout
      patron = described_class.for("fakeuser")
      expect(patron.email).to eq("")
    end
  end
end

RSpec.describe Search::Patron::Alma do
  before(:each) do
    @data = JSON.parse(fixture("alma_user.json"))
  end
  subject do
    described_class.new(@data)
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
  context "#sms" do
    it "returns properly formatted preferred_sms phone number if there is one" do
      expect(subject.sms).to eq("(888) 222-2222")
    end
    it "returns nil if there is not preferred_sms a phone number" do
      @data["contact_info"]["phone"][0]["preferred_sms"] = false
      expect(subject.sms).to be_nil
    end
  end
  context "#campus" do
    it "returns aa for Ann Arbor campus" do
      expect(subject.campus).to eq("aa")
    end
    it "returns flint for flint campus" do
      @data["campus_code"]["value"] = "UMFL"
      expect(subject.campus).to eq("flint")
    end
  end
  context "#logged_in?" do
    it "returns true" do
      expect(subject.logged_in?).to eq(true)
    end
  end
end

RSpec.describe Search::Patron::FromSession do
  before(:each) do
    @data = {email: "email", logged_in: true, sms: "sms", campus: "campus"}
  end
  subject do
    described_class.new(@data)
  end
  context "#email" do
    it "returns what is in the :email field" do
      expect(subject.email).to eq("email")
    end
  end
  context "#sms" do
    it "returns what is in the :sms field" do
      expect(subject.sms).to eq("sms")
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
    it "returns nil when there's no affiliation set" do
      expect(subject.affiliation).to be_nil
    end
    it "returns the value of whatever is in affiliation" do
      # this will either be aa or flint, but we aren't doing any checking here
      @data[:affiliation] = "aa"
      expect(subject.affiliation).to eq("aa")
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
  context "#sms" do
    it "returns empty string" do
      expect(subject.sms).to eq("")
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
end
