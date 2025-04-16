describe Search::Presenters::Record::Catalog::Full do
  single_string_fields = {
    edition: "Edition",
    series: "Series (transcribed)",
    series_statement: "Series Statement",
    note: "Note",
    physical_description: "Physical Description",
    created: "Created",
    biography_history: "Biography/History",
    in_collection: "In Collection",
    terms_of_use: "Terms of Use",
    date_place_of_event: "Date/Place of Event",
    references: "References",
    copyright_status_information: "Copyright status information",
    copyright: "Copyright",
    playing_time: "Playing Time",
    audience: "Audience",
    production_credits: "Production Credits",
    bibliography: "Bibliography",
    gov_doc_no: "Government Document Number",
    publisher_number: "Publisher Number",
    report_number: "Report Number",
    chronology: "Chronology",
    place: "Place",
    printer: "Printer",
    association: "Association"
  }
  multiple_string_fields = {
    language: "Language",
    published: "Published/Created",
    manufactured: "Manufactured",
    oclc: "OCLC Number",
    isbn: "ISBN",
    distributed: "Distributed",
    summary: "Summary",
    language_note: "Language note",
    performers: "Performers",
    preferred_citation: "Preferred Citation",
    location_of_originals: "Location of Originals",
    funding_information: "Funding Information",
    source_of_acquisition: "Source of Acquisition",
    related_items: "Related Items",
    numbering_notes: "Numbering Note",
    source_of_description_note: "Source of Description Note"
  }
  browse_fields = {
    contributors: "Contributors",
    call_number: "Call Number",
    lcsh_subjects: "Subjects (LCSH)"
  }

  before(:each) do
    plain_text_fields = (single_string_fields.keys + multiple_string_fields.keys).map do |f|
      [f, [OpenStruct.new(text: f.to_s), OpenStruct.new(text: "something_else")]]
    end.to_h

    browse_bib_fields = browse_fields.keys.map do |f|
      [
        f, [OpenStruct.new(
          text: "#{f}_text",
          url: "#{f}_url",
          browse_url: "#{f}_browse_url",
          kind: "#{f}_kind"
        )]
      ]
    end.to_h

    @bib_stub = instance_double(Search::Models::Record::Catalog::Bib,
      title: "This is a title",
      vernacular_title: "This is a v title",
      format: [
        OpenStruct.new(text: "format_text", icon: "icon_name")
      ],
      main_author: OpenStruct.new(
        text: "main_author_text",
        url: "main_author_url",
        browse_url: "main_author_browse_url",
        kind: "browse"
      ),
      vernacular_main_author: OpenStruct.new(
        text: "vernacular_main_author_text",
        url: "vernacular_main_author_url",
        browse_url: "vernacular_main_author_browse_url",
        kind: "browse"
      ),
      other_titles: [
        OpenStruct.new(text: "other_title_text", url: "other_title_search")
      ],
      related_title: [
        OpenStruct.new(text: "related_title_text", url: "related_title_search")
      ],
      academic_discipline: [
        ["Science", "Engineering"]
      ],
      **plain_text_fields,
      **browse_bib_fields)
  end
  subject do
    described_class.new(OpenStruct.new(bib: @bib_stub))
  end
  context "#title" do
    it "returns a title array for both title and v title when v title is present" do
      title = subject.title
      expect(title.first.text).to eq("This is a title")
      expect(title.first.css_class).to eq("title")
      expect(title[1].text).to eq("This is a v title")
      expect(title[1].css_class).to eq("vernacular")
    end
    it "only returns a default script title when there isn't a vernacular title" do
      allow(@bib_stub).to receive(:vernacular_title).and_return(nil)
      title = subject.title
      expect(title.count).to eq(1)
      expect(title.first.text).to eq("This is a title")
      expect(title.first.css_class).to eq("title")
    end
  end
  context "#main_author" do
    it "returns an appropriate field" do
      expect(subject.main_author.field).to eq("Author/Creator")
    end
    it "has the main_author has the first object" do
      ma = subject.main_author.data.first
      expect(ma.partial).to eq("browse")
      expect(ma.locals).to eq(@bib_stub.main_author)
    end
    it "has the vernacular main_author as the second field" do
      vma = subject.main_author.data[1]
      expect(vma.partial).to eq("browse")
      expect(vma.locals).to eq(@bib_stub.vernacular_main_author)
    end
    it "handles missing vernacular main author" do
      allow(@bib_stub).to receive(:vernacular_main_author).and_return(nil)
      expect(subject.main_author.data.count).to eq(1)
    end
  end
  context "#academic_discipline" do
    it "returns an appropriate field" do
      expect(subject.academic_discipline.field).to eq("Academic Discipline")
    end
    it "returns an academic_discipline object for data" do
      expect(subject.academic_discipline.data.first.partial).to eq("academic_discipline")
      expect(subject.academic_discipline.data.first.locals.disciplines).to eq(@bib_stub.academic_discipline.first)
    end
  end
  context "Array browse fields" do
    browse_fields.each do |field, name|
      context "##{field}" do
        it "returns the appropriate field" do
          expect(subject.public_send(field).field).to eq(name)
        end
        it "returns a browse object for data" do
          expect(subject.public_send(field).data.first.partial).to eq("browse")
          expect(subject.public_send(field).data.first.locals).to eq(@bib_stub.public_send(field).first)
        end
        it "returns nil if #{field} is nil" do
          allow(@bib_stub).to receive(field).and_return([])
          expect(subject.public_send(field)).to be_nil
        end
      end
    end
  end
  context "#other_titles" do
    it "returns the appropriate field" do
      expect(subject.other_titles.field).to eq("Other Titles")
    end
    it "returns a link_to object for data entity" do
      expect(subject.other_titles.data.first.partial).to eq("link_to")
      expect(subject.other_titles.data.first.locals).to eq(@bib_stub.other_titles.first)
    end
  end
  context "#related_title" do
    it "returns the appropriate field" do
      expect(subject.related_title.field).to eq("Related Title")
    end
    it "returns a link_to object for data entity" do
      expect(subject.related_title.data.first.partial).to eq("link_to")
      expect(subject.related_title.data.first.locals).to eq(@bib_stub.related_title.first)
    end
  end

  context "Multiple String plain text fields" do
    multiple_string_fields.each do |field, name|
      context "##{field}" do
        it "returns the appropriate field" do
          expect(subject.public_send(field).field).to eq(name)
        end
        it "returns a plain_text object for data entity" do
          expect(subject.public_send(field).data.first.partial).to eq("plain_text")
          expect(subject.public_send(field).data.first.locals).to eq(@bib_stub.public_send(field).first)
        end
        it "can have more than one data entity" do
          expect(subject.public_send(field).data.count).to eq(2)
        end
      end
    end
  end

  context "Single String plain text fields" do
    single_string_fields.each do |field, name|
      context "##{field}" do
        it "returns the appropriate field" do
          expect(subject.public_send(field).field).to eq(name)
        end
        it "returns a plain_text object for data entity" do
          expect(subject.public_send(field).data.first.partial).to eq("plain_text")
          expect(subject.public_send(field).data.first.locals).to eq(@bib_stub.public_send(field).first)
        end
        it "can have more than one data entity" do
          expect(subject.public_send(field).data.count).to eq(1)
        end
      end
    end
  end
end
