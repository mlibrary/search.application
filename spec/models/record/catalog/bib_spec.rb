RSpec.describe Search::Models::Record::Catalog::Bib do
  before(:each) do
    @data = JSON.parse(fixture("record/catalog/land_birds.json"))
    @data["created"] = [{"text" => "Created text"}]
    @data["biography_history"] = [{"text" => "Biography/History text"}]
    @data["in_collection"] = [{"text" => "In Collection text"}]
    @data["terms_of_use"] = [{"text" => "Terms of Use text"}]
    @data["date_place_of_event"] = [{"text" => "Date/Place of Event text"}]
    @data["references"] = [{"text" => "References text"}]
    @data["copyright_status_information"] = [{"text" => "Copyright status information text"}]
    @data["copyright"] = [{"text" => "Copyright text"}]
    @data["playing_time"] = [{"text" => "Playing Time text"}]
    @data["audience"] = [{"text" => "Audience text"}]
    @data["production_credits"] = [{"text" => "Production Credits text"}]
    @data["bibliography"] = [{"text" => "Bibliography text"}]
    @data["gov_doc_no"] = [{"text" => "Government Document Number text"}]
    @data["publisher_number"] = [{"text" => "Publisher Number text"}]
    @data["report_number"] = [{"text" => "Report Number text"}]
    @data["chronology"] = [{"text" => "Chronology text"}]
    @data["place"] = [{"text" => "Place text"}]
    @data["printer"] = [{"text" => "Printer text"}]
    @data["association"] = [{"text" => "Association text"}]
    @data["distributed"] = [{"text" => "Distributed text"}]
    @data["summary"] = [{"text" => "Summary text"}]
    @data["language_note"] = [{"text" => "Language note text"}]
    @data["performers"] = [{"text" => "Performers text"}]
    @data["preferred_citation"] = [{"text" => "Preferred Citation text"}]
    @data["location_of_originals"] = [{"text" => "Location of Originals text"}]
    @data["funding_information"] = [{"text" => "Funding Information text"}]
  end

  def author_browse_item_expectations(subject)
    expect(subject.text).to eq("text_string")
    expect(subject.url).to eq("#{S.base_url}/catalog?query=author:(\"search_string\")")
    expect(subject.browse_url).to eq("#{S.base_url}/catalog/browse/author?query=browse_string")
    expect(subject.kind).to eq("author")
  end

  subject do
    described_class.new(@data)
  end
  context "#title" do
    it "has a title" do
      expect(subject.title).to eq("Sanʼya no tori = Concise field guide to land birds / kaisetsu Saeki Akimitsu ; e Taniguchi Takashi.")
    end
  end
  context "#vernacular_title" do
    it "has a vernacular_title" do
      expect(subject.vernacular_title).to eq("山野の鳥 = Concise field guide to land birds / 解說佐伯彰光 ; 絵谷口高司.")
    end
    it "in nil if there is no vernacular_title" do
      @data["title"].delete_at(1)
      expect(subject.vernacular_title).to be_nil
    end
  end
  context "#other_titles" do
    it "has text and search" do
      @data["other_titles"][0]["text"] = "text_string"
      @data["other_titles"][0]["search"] = "search_string"
      expect(subject.other_titles.first.text).to eq("text_string")
      expect(subject.other_titles.first.url).to eq("#{S.base_url}/catalog?query=title%3Asearch_string")
    end
  end
  context "#related_title" do
    it "has text and search" do
      @data["related_title"] = [{"text" => "text_string", "search" => "search_string"}]
      expect(subject.related_title.first.text).to eq("text_string")
      expect(subject.related_title.first.url).to eq("#{S.base_url}/catalog?query=title%3Asearch_string")
    end
  end
  context "#main_author" do
    it "has text, url, browse_url, and kind" do
      @data["main_author"][0]["text"] = "text_string"
      @data["main_author"][0]["search"] = "search_string"
      @data["main_author"][0]["browse"] = "browse_string"
      author_browse_item_expectations(subject.main_author)
    end
    it "handles empty main author" do
      @data["main_author"] = nil
      expect(subject.main_author).to be_nil
    end
  end
  context "#vernacular_main_author" do
    it "has text, url, browse_url, and kind" do
      @data["main_author"][1]["text"] = "text_string"
      @data["main_author"][1]["search"] = "search_string"
      @data["main_author"][1]["browse"] = "browse_string"
      author_browse_item_expectations(subject.vernacular_main_author)
    end

    it "handles empty vernacular main author" do
      @data["main_author"].delete_at(1)
      expect(subject.vernacular_main_author).to be_nil
    end
  end
  context "#contributors" do
    it "is an array with text, url, browse_url, and kind" do
      @data["contributors"][0]["text"] = "text_string"
      @data["contributors"][0]["search"] = "search_string"
      @data["contributors"][0]["browse"] = "browse_string"
      author_browse_item_expectations(subject.contributors.first)
    end
  end
  # call_number: "QL 691 .J3 S25 1983",

  context "#call_number" do
    it "is an array with objects of text, url, browse_url, and kind" do
      cn = "QL 691 .J3 S25 1983"
      s = subject.call_number.first
      expect(s.text).to eq(cn)
      expect(s.url).to be_nil
      expect(s.browse_url).to eq("#{S.base_url}/catalog/browse/callnumber?query=#{cn}")
      expect(s.kind).to eq("call_number")
    end
  end

  context "#lcsh_subjects" do
    it "is an array objects of text, url, browse_url, and kind" do
      lcsh = "Birds -- Japan -- Identification"
      lcsh_norm = "Birds Japan Identification"
      s = subject.lcsh_subjects.first
      expect(s.text).to eq(lcsh)
      expect(CGI.unescape(s.url)).to eq("#{S.base_url}/catalog?query=subject:\"#{lcsh_norm}\"")
      expect(CGI.unescape(s.browse_url)).to eq("#{S.base_url}/catalog/browse/subject?query=#{lcsh_norm}")
    end
  end
  context "#format" do
    it "shows the icons for the formats in the marc" do
      format = subject.format.first
      expect(format.text).to eq("Book")
      expect(format.icon).to eq("book")
    end
  end
  context "#published" do
    it "is an array of strings" do
      p = subject.published
      expect(p[0].text).to eq("Tōkyō : Nihon Yachō no Kai, 1983")
      expect(p[1].text).to eq("東京 : 日本野鳥の会, 1983")
    end
  end
  context "#manufactured" do
    it "is an array of strings" do
      @data["manufactured"][1]["text"] = "vernacular manufactured text"
      expect(subject.manufactured[0].text).to eq("(1984 printing)")
      expect(subject.manufactured[1].text).to eq("vernacular manufactured text")
    end
  end

  context "#academic_discipline" do
    it "is an array of arrays of strings" do
      expect(subject.academic_discipline).to eq([
        [
          "Science",
          "Biology",
          "Zoology"
        ], [
          "Science",
          "Biology",
          "Ecology and Evolutionary Biology"
        ]
      ])
    end
  end

  {
    language: "Japanese",
    oclc: "23343161",
    isbn: "4931150012 :",
    edition: "3-teiban.",
    series: "Yagai kansatsu handobukku ; 1",
    series_statement: "Yagai kansatsu handobukku ; 1.",
    note: "Includes index.",
    physical_description: "64 p. : ill. ; 18 cm.",
    created: "Created text",
    biography_history: "Biography/History text",
    in_collection: "In Collection text",
    terms_of_use: "Terms of Use text",
    date_place_of_event: "Date/Place of Event text",
    references: "References text",
    copyright_status_information: "Copyright status information text",
    copyright: "Copyright text",
    playing_time: "Playing Time text",
    audience: "Audience text",
    production_credits: "Production Credits text",
    bibliography: "Bibliography text",
    gov_doc_no: "Government Document Number text",
    publisher_number: "Publisher Number text",
    report_number: "Report Number text",
    chronology: "Chronology text",
    place: "Place text",
    printer: "Printer text",
    association: "Association text",
    distributed: "Distributed text",
    summary: "Summary text",
    language_note: "Language note text",
    performers: "Performers text",
    preferred_citation: "Preferred Citation text",
    location_of_originals: "Location of Originals text",
    funding_information: "Funding Information text"
  }.each do |uid, value|
    context "##{uid}" do
      it "is an array of OpenStructs that respond to text" do
        expect(subject.public_send(uid)[0].text).to eq(value)
      end
    end
  end
end
