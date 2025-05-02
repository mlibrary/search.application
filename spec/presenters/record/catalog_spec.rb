describe Search::Presenters::Record::Catalog::Full do
  my_parallel_plain_text_fields = {
    access: "Access",
    arrangement: "Arrangement",
    association: "Association",
    audience: "Audience",
    awards: "Awards",
    bibliography: "Bibliography",
    biography_history: "Biography/History",
    chronology: "Chronology",
    content_advice: "Content advice",
    copy_specific_note: "Copy Specific Note",
    copyright: "Copyright",
    copyright_status_information: "Copyright status information",
    created: "Created",
    current_publication_frequency: "Current Publication Frequency",
    date_place_of_event: "Date/Place of Event",
    distributed: "Distributed",
    edition: "Edition",
    extended_summary: "Expanded Summary",
    former_publication_frequency: "Former Publication Frequency",
    funding_information: "Funding Information",
    in_collection: "In Collection",
    language_note: "Language note",
    location_of_originals: "Location of Originals",
    manufactured: "Manufactured",
    map_scale: "Map Scale",
    note: "Note",
    numbering: "Numbering",
    numbering_notes: "Numbering Note",
    original_version_note: "Original version note",
    performers: "Performers",
    physical_description: "Physical Description",
    place: "Place",
    playing_time: "Playing Time",
    preferred_citation: "Preferred Citation",
    printer: "Printer",
    production_credits: "Production Credits",
    published: "Published/Created",
    references: "References",
    related_items: "Related Items",
    reproduction_note: "Reproduction note",
    series: "Series (transcribed)",
    series_statement: "Series Statement",
    source_of_acquisition: "Source of Acquisition",
    source_of_description_note: "Source of Description Note",
    summary: "Summary",
    terms_of_use: "Terms of Use"
  }
  single_string_fields = {
    gov_doc_no: "Government Document Number",
    publisher_number: "Publisher Number",
    report_number: "Report Number"
  }
  multiple_string_fields = {
    language: "Language",
    oclc: "OCLC Number",
    isbn: "ISBN",
    issn: "ISSN",
    bookplate: "Donor Information"
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

    parallel_plain_text_fields = my_parallel_plain_text_fields.keys.map do |uid|
      [uid, [
        double("paired_text",
          transliterated: double("text", text: Faker::Lorem.sentence),
          original: double("text", text: Faker::Lorem.sentence))
      ]]
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
      title: double("paired_text",
        transliterated: double("text", text: Faker::Book.title),
        original: double("text", text: Faker::Book.title)),
      format: [
        OpenStruct.new(text: "format_text", icon: "icon_name")
      ],
      main_author: OpenStruct.new(
        text: "main_author_text",
        url: "main_author_url",
        browse_url: "main_author_browse_url",
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
      **parallel_plain_text_fields,
      **plain_text_fields,
      **browse_bib_fields)
  end
  subject do
    described_class.new(OpenStruct.new(bib: @bib_stub))
  end
  context "#title" do
    it "returns a title array for both title and v title when v title is present" do
      title = subject.title
      expect(title.first.text).to eq(@bib_stub.title.transliterated.text)
      expect(title.first.css_class).to eq("title-primary")
      expect(title[1].text).to eq(@bib_stub.title.original.text)
      expect(title[1].css_class).to eq("title-secondary")
    end
    it "only returns original if that's all there is" do
      allow(@bib_stub.title).to receive(:transliterated).and_return(nil)
      title = subject.title
      expect(title.first.text).to eq(@bib_stub.title.original.text)
      expect(title.first.css_class).to eq("title-primary")
      expect(title.count).to eq(1)
    end
    it "only returns transliterated if that's all there is; this should never happen" do
      allow(@bib_stub.title).to receive(:original).and_return(nil)
      title = subject.title
      expect(title.first.text).to eq(@bib_stub.title.transliterated.text)
      expect(title.first.css_class).to eq("title-primary")
      expect(title.count).to eq(1)
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

  context "Parallel plain text fields" do
    my_parallel_plain_text_fields.each do |uid, name|
      context "##{uid}" do
        it "returns the appropriate field" do
          expect(subject.public_send(uid).field).to eq(name)
        end
        it "returns the appropriate partial" do
          expect(subject.public_send(uid).partial).to eq("parallel_plain_text")
        end
        it "returns the appropriate data" do
          expect(subject.public_send(uid).locals).to eq(@bib_stub.public_send(uid))
        end
      end
    end
  end
  context "Multiple String plain text fields" do
    multiple_string_fields.each do |field, name|
      context "##{field}" do
        it "returns the appropriate field" do
          expect(subject.public_send(field).field).to eq(name)
        end
        it "returns a 'plain_text' partial" do
          expect(subject.public_send(field).partial).to eq("plain_text")
        end
        it "returns a locals from model" do
          expect(subject.public_send(field).locals).to eq(@bib_stub.public_send(field))
        end
        it "can have more than one data entity" do
          expect(subject.public_send(field).locals.count).to eq(2)
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
        it "returns the appropriate partial" do
          expect(subject.public_send(field).partial).to eq("plain_text")
        end
        it "returns locals from the model" do
          expect(subject.public_send(field).locals.first).to eq(@bib_stub.public_send(field).first)
        end
        it "can have more than one locals entity" do
          expect(subject.public_send(field).locals.count).to eq(1)
        end
      end
    end
  end
end
