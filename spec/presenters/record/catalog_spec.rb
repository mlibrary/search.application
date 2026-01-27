describe Search::Presenters::Record::Catalog::Full do
  parallel_plain_text_fields = {
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
  parallel_link_to_fields = {
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

  subject do
    described_class.new(@record)
  end
  context "#id" do
    it "returns the mms_id for the record" do
      @record = create(:catalog_record)
      expect(subject.id).to eq(@record.bib.id)
    end
  end
  context "#title" do
    it "returns a title array for both title and v title when v title is present" do
      @record = create(:catalog_record, {bib_fields: [:title]})
      title = subject.title
      expect(title.first.text).to eq(@record.bib.title.original.text)
      expect(title.first.css_class).to eq("title-primary")
      expect(title[1].text).to eq(@record.bib.title.transliterated.text)
      expect(title[1].css_class).to eq("title-secondary")
    end
    it "only returns original if that's all there is" do
      @record = create(:catalog_record)
      allow(@record.bib).to receive(:title).and_return(create(:single_script_paired_text_item))
      title = subject.title
      expect(title.first.text).to eq(@record.bib.title.original.text)
      expect(title.first.css_class).to eq("title-primary")
      expect(title.count).to eq(1)
    end
  end

  context "#format" do
    before(:each) do
      @record = create(:catalog_record, {bib_fields: [:format]})
    end
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
      expect(first_format).to eq(@record.bib.format.first)
    end
  end
  context "Author Browse Fields" do
    author_browse_fields.each do |uid, name|
      context "##{uid}" do
        before(:each) do
          @record = create(:catalog_record, {bib_fields: [uid]})
        end
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
          expect(subject.public_send(uid).values.first.original.text).to eq(@record.bib.public_send(uid).first.original.text)
        end
        it "returns nil if #{uid} is nil" do
          allow(@record.bib).to receive(uid).and_return([])
          expect(subject.public_send(uid)).to be_nil
        end
      end
    end
  end
  context "Array browse fields" do
    browse_fields.each do |uid, name|
      context "##{uid}" do
        before(:each) do
          @record = create(:catalog_record, {bib_fields: [uid]})
        end
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
          expect(subject.public_send(uid).values).to eq(@record.bib.public_send(uid))
        end

        it "returns nil if #{uid} is nil" do
          allow(@record.bib).to receive(uid).and_return([])
          expect(subject.public_send(uid)).to be_nil
        end
      end
    end
  end
  context "Parallel link_to fields" do
    parallel_link_to_fields.each do |uid, name|
      context "##{uid}" do
        before(:each) do
          @record = create(:catalog_record, {bib_fields: [uid]})
        end
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
          expect(subject.public_send(uid).values).to eq(@record.bib.public_send(uid))
        end
      end
    end
  end

  context "#shelf_browse" do
    it "calls ShelfBrowse with the provided call number" do
      @record = create(:catalog_record, {bib_fields: [:call_number]})
      call_number = @record.bib.call_number.first.text

      expect(Search::Presenters::Record::Catalog::ShelfBrowse).to receive(:for).with(call_number: call_number)
      subject.shelf_browse
    end
  end
  context "#academic_discipline" do
    before(:each) do
      @record = create(:catalog_record, {bib_fields: [:academic_discipline]})
    end
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
      expect(first_discipline).to eq(@record.bib.academic_discipline.first.disciplines.first)
    end
  end

  context "#indexing_date" do
    it "returns the correct date with the appropriate formatting" do
      @record = create(:catalog_record, {other_fields: [:indexing_date]})
      # this is duplicative of the actual code. Format is January 1, 2026
      expect(subject.indexing_date).to eq(@record.indexing_date.strftime("%B %-d, %Y"))
    end
  end
  context "#marc_record" do
    it "returns marc json" do
      marc = {"some_example" => "whatever"}
      @record = create(:catalog_record)
      allow(@record).to receive(:marc).and_return(marc)
      expect(subject.marc_record).to eq(marc)
    end
  end

  context "#csl" do
    it "returns the csl metadata hash" do
      @record = create(:catalog_record, other_fields: [:citation])
      allow(@record.citation).to receive(:csl).and_return({"type" => "book"})
      expect(subject.csl["type"]).to eq("book")
    end
  end

  context "Parallel plain text fields" do
    parallel_plain_text_fields.each do |uid, name|
      context "##{uid}" do
        before(:each) do
          @record = create(:catalog_record, {bib_fields: [uid]})
        end
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
          expect(subject.public_send(uid).values).to eq(@record.bib.public_send(uid))
        end
        it "returns nil if #{uid} is nil" do
          allow(@record.bib).to receive(uid).and_return([])
          expect(subject.public_send(uid)).to be_nil
        end
      end
    end
  end
  context "Multiple String plain text fields" do
    multiple_string_fields.each do |uid, name|
      context "##{uid}" do
        before(:each) do
          @record = create(:catalog_record, {bib_fields: [uid]})
        end
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
          expect(subject.public_send(uid).values).to eq(@record.bib.public_send(uid))
        end
        it "can have more than one data entity" do
          expect(subject.public_send(uid).values.count).to eq(2)
        end
        it "returns nil if #{uid} is nil" do
          allow(@record.bib).to receive(uid).and_return([])
          expect(subject.public_send(uid)).to be_nil
        end
      end
    end
  end

  context "Single String plain text fields" do
    single_string_fields.each do |uid, name|
      context "##{uid}" do
        before(:each) do
          @record = create(:catalog_record, {bib_fields: [uid]})
        end
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
          expect(subject.public_send(uid).values.first).to eq(@record.bib.public_send(uid).first)
        end
        it "can have more than one values entity" do
          expect(subject.public_send(uid).values.count).to eq(1)
        end
        it "returns nil if #{uid} is nil" do
          allow(@record.bib).to receive(uid).and_return([])
          expect(subject.public_send(uid)).to be_nil
        end
      end
    end
  end
end
describe Search::Presenters::Record::Catalog::Brief do
  let(:record) { create(:catalog_record, bib_fields: [:title, :main_author, :published, :series], other_fields: [:citation]) }
  subject do
    described_class.new(record)
  end
  context "#metadata" do
    it "has metadata" do
      main_author = subject.metadata[0]
      published = subject.metadata[1]
      series = subject.metadata[2]
      expect(main_author.field).to eq("Author/Creator")
      expect(published.field).to eq("Published/Created")
      expect(series.field).to eq("Series (transcribed)")
    end
  end
  context "#to_h" do
    it "returns the expected hash" do
      bib_stub = record.bib
      citation_stub = record.citation
      allow(citation_stub).to receive(:ris).and_return(Faker::Lorem.paragraph)
      allow(citation_stub).to receive(:csl).and_return({"type" => "book"})
      expected = {
        title: {
          original: bib_stub.title.original.text,
          transliterated: bib_stub.title.transliterated.text
        },
        metadata: [
          {
            field: "Author/Creator",
            original: bib_stub.main_author.first.original.text,
            transliterated: bib_stub.main_author.first.transliterated.text
          },
          {
            field: "Published/Created",
            original: bib_stub.published.first.original.text,
            transliterated: bib_stub.published.first.transliterated.text
          },
          {
            field: "Series (transcribed)",
            original: bib_stub.series.first.original.text,
            transliterated: bib_stub.series.first.transliterated.text
          }
        ],
        url: "#{S.base_url}/catalog/record/#{bib_stub.id}",
        citation: {
          ris: citation_stub.ris,
          csl: citation_stub.csl
        },
        holding: {
          call_number: nil,
          location: nil
        }
      }
      expect(subject.to_h).to eq(expected)
    end
  end
end
