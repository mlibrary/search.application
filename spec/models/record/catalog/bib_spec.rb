RSpec.describe Search::Models::Record::Catalog::Bib do
  before(:each) do
    @data = create(:catalog_api_record)
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
  [:title].each do |field|
    context "##{field}" do
      it "has transliterated and original text" do
        expect(subject.public_send(field).transliterated.text).to eq(@data[field.to_s].first["transliterated"]["text"])
        expect(subject.public_send(field).original.text).to eq(@data[field.to_s].first["original"]["text"])
      end
    end
  end
  # These return a structure like this:
  # [
  #   {
  #     transliterated: {text:"" },
  #     original: {text: "" }
  #   }
  # ]
  [:access, :arrangement, :association, :audience, :awards, :bibliography,
    :biography_history, :chronology, :content_advice,
    :copy_specific_note, :copyright, :copyright_status_information, :created,
    :current_publication_frequency, :date_place_of_event, :distributed, :edition,
    :extended_summary, :former_publication_frequency, :funding_information,
    :in_collection, :language_note, :location_of_originals, :manufactured,
    :map_scale, :note, :numbering, :numbering_notes, :original_version_note,
    :performers, :physical_description, :place, :playing_time,
    :preferred_citation, :printer, :production_credits, :published, :references,
    :related_items, :reproduction_note, :series, :series_statement,
    :source_of_acquisition, :source_of_description_note, :summary, :terms_of_use].each do |field|
    context "##{field}" do
      it "has transliterated and original text" do
        expect(subject.public_send(field).first.transliterated.text).to eq(@data[field.to_s].first["transliterated"]["text"])
        expect(subject.public_send(field).first.original.text).to eq(@data[field.to_s].first["original"]["text"])
      end
      it "only has original text if transliterated and original are the same" do
        @data[field.to_s].first["transliterated"]["text"] = @data[field.to_s].first["original"]["text"]
        expect(subject.public_send(field).first.original.text).to eq(@data[field.to_s].first["original"]["text"])
        expect(subject.public_send(field).first.transliterated).to be_nil
      end
    end
  end

  ["other_titles", "related_title"].each do |field|
    context "##{field}" do
      it "has text and search" do
        expected = {
          transliterated:
          {
            text: @data[field].first["transliterated"]["text"],
            search_string: @data[field].first["transliterated"]["search"].first["value"],
            field: @data[field].first["transliterated"]["search"].first["field"]
          },
          original:
          {
            text: @data[field].first["original"]["text"],
            search_string: @data[field].first["original"]["search"].first["value"],
            field: @data[field].first["original"]["search"].first["field"]
          }
        }

        my_subject = subject.public_send(field).first
        expect(my_subject.transliterated.text).to eq(expected[:transliterated][:text])
        expect(my_subject.transliterated.url)
          .to eq("#{S.base_url}/catalog?" + {query: "#{expected[:transliterated][:field]}:\"#{expected[:transliterated][:search_string]}\""}.to_query)

        expect(my_subject.original.text).to eq(expected[:original][:text])
        expect(my_subject.original.url)
          .to eq("#{S.base_url}/catalog?" + {query: "#{expected[:original][:field]}:\"#{expected[:original][:search_string]}\""}.to_query)
      end
    end
  end
  ["main_author", "contributors"].each do |field|
    context "##{field}" do
      it "has an author browse result" do
        expected = {
          transliterated:
          {
            text: @data[field].first["transliterated"]["text"],
            search_string: @data[field].first["transliterated"]["search"].first["value"],
            field: @data[field].first["transliterated"]["search"].first["field"],
            browse: @data[field].first["transliterated"]["browse"]
          },
          original:
          {
            text: @data[field].first["original"]["text"],
            search_string: @data[field].first["original"]["search"].first["value"],
            field: @data[field].first["original"]["search"].first["field"],
            browse: @data[field].first["original"]["browse"]
          }
        }

        my_subject = subject.public_send(field).first
        expect(my_subject.transliterated.url)
          .to eq("#{S.base_url}/catalog?" + {query: "#{expected[:transliterated][:field]}:\"#{expected[:transliterated][:search_string]}\""}.to_query)
        expect(my_subject.transliterated.text).to eq(expected[:transliterated][:text])
        expect(my_subject.transliterated.browse_url)
          .to eq("#{S.base_url}/catalog/browse/author?" + {query: expected[:transliterated][:browse]}.to_query)
        expect(my_subject.transliterated.kind).to eq("author")

        expect(my_subject.original.url)
          .to eq("#{S.base_url}/catalog?" + {query: "#{expected[:original][:field]}:\"#{expected[:original][:search_string]}\""}.to_query)
        expect(my_subject.original.text).to eq(expected[:original][:text])
        expect(my_subject.original.browse_url)
          .to eq("#{S.base_url}/catalog/browse/author?" + {query: expected[:original][:browse]}.to_query)
        expect(my_subject.original.kind).to eq("author")
      end
      it "handles empty #{field}" do
        @data[field] = []
        expect(subject.public_send(field)).to eq([])
      end
    end
  end

  context "#call_number" do
    it "is an array with objects of text, url, browse_url, and kind" do
      cn = @data["call_number"][0]["text"]
      s = subject.call_number.first
      expect(s.text).to eq(cn)
      expect(s.url).to be_nil
      expect(s.browse_url).to eq("#{S.base_url}/catalog/browse/callnumber?#{{query: cn}.to_query}")
      expect(s.kind).to eq("call_number")
    end
  end

  context "#lcsh_subjects" do
    it "is an array objects of text, url, browse_url, and kind" do
      lcsh = "Birds -- Japan -- Identification"
      @data["lcsh_subjects"][0]["text"] = lcsh
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

  context "#academic_discipline" do
    it "is an array of arrays of strings" do
      ad = subject.academic_discipline.first.disciplines.first
      expect(ad.text).to eq("Science")
      expect(ad.url).to eq("#{S.base_url}/catalog?" + {query: "academic_discipline:Science"}.to_query)
    end
  end

  [:bookplate, :gov_doc_no, :isbn, :issn, :language, :oclc, :publisher_number,
    :report_number].each do |uid|
    context "##{uid}" do
      it "is an array of OpenStructs that respond to text" do
        expected = @data[uid.to_s].first["text"]
        expect(subject.public_send(uid)[0].text).to eq(expected)
      end
      it "does not include duplicates entries" do
        @data[uid.to_s].push({"text" => @data[uid.to_s].first["text"]})
        expect(subject.public_send(uid).count).to eq(1)
      end
    end
  end
end
