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
    finding_aids: "Indexes/Finding Aids",
    former_publication_frequency: "Former Publication Frequency",
    funding_information: "Funding Information",
    in_collection: "In Collection",
    language_note: "Language note",
    location_of_originals: "Location of Originals",
    manufactured: "Manufactured",
    map_scale: "Map Scale",
    media_format: "Media Format",
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
    publisher_number: "Publisher Number",
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
  my_parallel_link_to_fields = {
    new_title: "New Title",
    related_title: "Related Title",
    preferred_title: "Preferred Title",
    previous_title: "Previous Title",
    other_titles: "Other Titles"
  }
  single_string_fields = {
    contents: "Contents",
    gov_doc_number: "Government Document Number",
    report_number: "Report Number"
  }
  multiple_string_fields = {
    bookplate: "Donor Information",
    isbn: "ISBN",
    issn: "ISSN",
    language: "Language",
    new_title_issn: "New Title ISSN",
    previous_title_issn: "Previous Title ISSN",
    oclc: "OCLC Number",
    other_subjects: "Subjects (Other)"
  }
  browse_fields = {
    call_number: "Call Number",
    lc_subjects: "Subjects (LCSH)",
    remediated_lc_subjects: "Subjects (Local)"
  }
  author_browse_fields = {
    main_author: "Author/Creator",
    contributors: "Contributors"

  }

  def create_parallel_plain_text(uid, bib_stub)
    allow(bib_stub).to receive(uid).and_return(
      [double("paired_text",
        transliterated: double("text", text: Faker::Lorem.sentence),
        original: double("text", text: Faker::Lorem.sentence))]
    )
  end

  let(:indexing_date) { Date.parse("2025-01-01") }

  before(:each) do
    plain_text_fields = (single_string_fields.keys + multiple_string_fields.keys).map do |f|
      [f, [OpenStruct.new(text: f.to_s), OpenStruct.new(text: "something_else")]]
    end.to_h

    # parallel_plain_text_fields = my_parallel_plain_text_fields.keys.map do |uid|
    #   [uid, [
    #     double("paired_text",
    #       transliterated: double("text", text: Faker::Lorem.sentence),
    #       original: double("text", text: Faker::Lorem.sentence))
    #   ]]
    # end.to_h

    parallel_link_to_fields = my_parallel_link_to_fields.keys.map do |uid|
      [uid, [
        double("paired_text",
          transliterated: double("text", text: Faker::Lorem.sentence, url: Faker::Internet.url),
          original: double("text", text: Faker::Lorem.sentence, url: Faker::Internet.url))
      ]]
    end.to_h

    author_browse_bib_fields = author_browse_fields.keys.map do |f|
      [f, [

        double("paired",
          transliterated: double("author_browse",
            text: Faker::Lorem.sentence,
            url: Faker::Internet.url,
            browse_url: Faker::Internet.url,
            kind: "author"),
          original: double("author_browse",
            text: Faker::Lorem.sentence,
            url: Faker::Internet.url,
            browse_url: Faker::Internet.url,
            kind: "author"))

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
    @marc = {}
    @bib_stub = instance_double(Search::Models::Record::Catalog::Bib,
      title: Search::Models::Record::Catalog::Bib::PairedItem.for({
        "transliterated" => double("text", text: Faker::Book.title),
        "original" => double("text", text: Faker::Book.title)
      }),
      format: [
        OpenStruct.new(text: "format_text", icon: "icon_name")
      ],
      academic_discipline: [
        OpenStruct.new(disciplines: [
          OpenStruct.new(text: Faker::Lorem.word, url: Faker::Internet.url)
        ])
      ],
      **parallel_link_to_fields,
      **author_browse_bib_fields,
      # **parallel_plain_text_fields,
      **plain_text_fields,
      **browse_bib_fields)
  end
  let(:record) { create(:catalog_record) }
  subject do
    allow(record).to receive(:bib).and_return(@bib_stub)
    allow(record).to receive(:indexing_date).and_return(indexing_date)
    allow(record).to receive(:marc).and_return(@marc)
    described_class.new(record)
  end
  context "#title" do
    it "returns a title array for both title and v title when v title is present" do
      title = subject.title
      expect(title.first.text).to eq(@bib_stub.title.original.text)
      expect(title.first.css_class).to eq("title-primary")
      expect(title[1].text).to eq(@bib_stub.title.transliterated.text)
      expect(title[1].css_class).to eq("title-secondary")
    end
    it "only returns original if that's all there is" do
      allow(@bib_stub).to receive(:title).and_return(Search::Models::Record::Catalog::Bib::PairedItem.for({
        "original" => double("text", text: Faker::Book.title, paired?: false)
      }))
      title = subject.title
      expect(title.first.text).to eq(@bib_stub.title.text)
      expect(title.first.css_class).to eq("title-primary")
      expect(title.count).to eq(1)
    end
  end

  context "#format" do
    it "returns the appropriate uid" do
      expect(subject.format.uid).to eq("format")
    end
    it "returns an appropriate field" do
      expect(subject.format.field).to eq("Formats")
    end
    it "returns a 'format' partial" do
      expect(subject.format.partial).to eq("format")
    end
    it "returns a format object for data" do
      first_format = subject.format.values.first
      expect(first_format).to eq(@bib_stub.format.first)
    end
  end
  context "Author Browse Fields" do
    author_browse_fields.each do |uid, name|
      context "##{uid}" do
        it "returns the appropriate uid" do
          expect(subject.public_send(uid).uid).to eq(uid)
        end
        it "returns an appropriate field" do
          expect(subject.public_send(uid).field).to eq(name)
        end
        it "returns a 'browse' partial" do
          expect(subject.public_send(uid).partial).to eq("browse")
        end
        it "returns values that match model" do
          expect(subject.public_send(uid).values.first.original.text).to eq(@bib_stub.public_send(uid).first.original.text)
        end
        it "returns nil if #{uid} is nil" do
          allow(@bib_stub).to receive(uid).and_return([])
          expect(subject.public_send(uid)).to be_nil
        end
      end
    end
  end
  context "#academic_discipline" do
    it "returns the appropriate uid" do
      expect(subject.academic_discipline.uid).to eq("academic_discipline")
    end
    it "returns an appropriate field" do
      expect(subject.academic_discipline.field).to eq("Academic Discipline")
    end
    it "returns an 'academic_discipline' partial" do
      expect(subject.academic_discipline.partial).to eq("academic_discipline")
    end
    it "returns an academic_discipline object for data" do
      first_discipline = subject.academic_discipline.values.first.disciplines.first
      expect(first_discipline).to eq(@bib_stub.academic_discipline.first.disciplines.first)
    end
  end
  context "Array browse fields" do
    browse_fields.each do |uid, name|
      context "##{uid}" do
        it "returns the appropriate uid" do
          expect(subject.public_send(uid).uid).to eq(uid)
        end
        it "returns the appropriate field name" do
          expect(subject.public_send(uid).field).to eq(name)
        end
        it "returns a 'browse' partial" do
          expect(subject.public_send(uid).partial).to eq("browse")
        end

        it "returns values that match model" do
          expect(subject.public_send(uid).values).to eq(@bib_stub.public_send(uid))
        end

        it "returns nil if #{uid} is nil" do
          allow(@bib_stub).to receive(uid).and_return([])
          expect(subject.public_send(uid)).to be_nil
        end
      end
    end
  end
  context "Parallel link_to fields" do
    my_parallel_link_to_fields.each do |uid, name|
      context "##{uid}" do
        it "returns the appropriate uid" do
          expect(subject.public_send(uid).uid).to eq(uid)
        end
        it "returns the appropriate field" do
          expect(subject.public_send(uid).field).to eq(name)
        end
        it "returns a link_to partial" do
          expect(subject.public_send(uid).partial).to eq("link_to")
        end
        it "returns the appropriate values" do
          expect(subject.public_send(uid).values).to eq(@bib_stub.public_send(uid))
        end
      end
    end
  end
  context "#shelf_browse" do
    it "calls ShelfBrowse with the provided call number" do
      expect(Search::Presenters::Record::Catalog::ShelfBrowse).to receive(:for).with(call_number: "call_number_text")
      subject.shelf_browse
    end
  end

  context "#indexing_date" do
    it "returns the correct date with the appropriate formatting" do
      expect(subject.indexing_date).to eq("January 1, 2025")
    end
  end
  context "#marc_record" do
    it "returns marc json" do
      @marc = {"some_example" => "whatever"}
      expect(subject.marc_record).to eq(@marc)
    end
  end

  context "Parallel plain text fields" do
    my_parallel_plain_text_fields.each do |uid, name|
      before(:each) do
        create_parallel_plain_text(uid, @bib_stub)
      end
      context "##{uid}" do
        it "returns the appropriate uid" do
          expect(subject.public_send(uid).uid).to eq(uid)
        end
        it "returns the appropriate field" do
          expect(subject.public_send(uid).field).to eq(name)
        end
        it "returns the appropriate partial" do
          expect(subject.public_send(uid).partial).to eq("plain_text")
        end
        it "returns the appropriate data" do
          expect(subject.public_send(uid).values).to eq(@bib_stub.public_send(uid))
        end
        it "returns nil if #{uid} is nil" do
          allow(@bib_stub).to receive(uid).and_return([])
          expect(subject.public_send(uid)).to be_nil
        end
      end
    end
  end
  context "Multiple String plain text fields" do
    multiple_string_fields.each do |uid, name|
      context "##{uid}" do
        it "returns the appropriate uid" do
          expect(subject.public_send(uid).uid).to eq(uid)
        end
        it "returns the appropriate field name" do
          expect(subject.public_send(uid).field).to eq(name)
        end
        it "returns a 'plain_text' partial" do
          expect(subject.public_send(uid).partial).to eq("plain_text")
        end
        it "returns a values from model" do
          expect(subject.public_send(uid).values).to eq(@bib_stub.public_send(uid))
        end
        it "can have more than one data entity" do
          expect(subject.public_send(uid).values.count).to eq(2)
        end
        it "returns nil if #{uid} is nil" do
          allow(@bib_stub).to receive(uid).and_return([])
          expect(subject.public_send(uid)).to be_nil
        end
      end
    end
  end

  context "Single String plain text fields" do
    single_string_fields.each do |uid, name|
      context "##{uid}" do
        it "returns the appropriate uid" do
          expect(subject.public_send(uid).uid).to eq(uid)
        end
        it "returns the appropriate field name" do
          expect(subject.public_send(uid).field).to eq(name)
        end
        it "returns the appropriate partial" do
          expect(subject.public_send(uid).partial).to eq("plain_text")
        end
        it "returns values from the model" do
          expect(subject.public_send(uid).values.first).to eq(@bib_stub.public_send(uid).first)
        end
        it "can have more than one values entity" do
          expect(subject.public_send(uid).values.count).to eq(1)
        end
        it "returns nil if #{uid} is nil" do
          allow(@bib_stub).to receive(uid).and_return([])
          expect(subject.public_send(uid)).to be_nil
        end
      end
    end
  end
end
