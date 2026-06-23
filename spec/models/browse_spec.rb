describe Search::Models::Browse do
  it "has academic disciplines" do
    data = [
      {"name" => "Business",
       "count" => 9999,
       "disciplines" => [
         {"name" => "Management",
          "count" => 1234,
          "disciplines" => []}

       ]}
    ]
    subject = described_class.new(data).academic_disciplines
    expect(subject.first.name).to eq("Business")
    expect(subject.first.count).to eq(9999)
    subdiscipline = subject.first.disciplines.first
    expect(subdiscipline.parents.first.name).to eq("Business")
    expect(subdiscipline.name).to eq("Management")
    expect(subdiscipline.count).to eq(1234)
  end
end
