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
