describe Search::Email::Whatever do
  before(:each) do
    Mail::TestMailer.deliveries.clear
  end

  it "sends an email?" do
    described_class.new.send(to: "someone@default.invalid")
    expect(Mail::TestMailer.deliveries.first.text_part.body.to_s).to eq("heya")
    expect(Mail::TestMailer.deliveries.first.html_part.body.to_s).to include("Blah")
  end
end
