class Search::Models::Record::Catalog::Bib
  FORMAT_ICONS = YAML.load_file(File.join(S.config_path, "format_icons.yaml"))
  def initialize(data)
    @data = data
  end

  [:title].each do |uid|
    define_method(uid) do
      result = OpenStruct.new
      @data[uid.to_s].first.to_a.each do |key, value|
        result[key.to_sym] = OpenStruct.new(text: value["text"])
      end
      result
    end
  end
  [:access, :arrangement, :association, :audience, :awards, :bibliography,
    :biography_history, :chronology, :content_advice, :copy_specific_note,
    :copyright, :copyright_status_information, :created,
    :current_publication_frequency, :date_place_of_event, :distributed, :edition,
    :extended_summary, :former_publication_frequency, :funding_information,
    :in_collection, :language_note, :location_of_originals, :manufactured,
    :map_scale, :note, :numbering, :numbering_notes, :original_version_note,
    :performers, :physical_description, :place, :playing_time,
    :preferred_citation, :printer, :production_credits, :published, :references,
    :related_items, :reproduction_note, :series, :series_statement,
    :source_of_acquisition, :source_of_description_note, :summary,
    :terms_of_use].each do |uid|
    define_method(uid) do
      @data[uid.to_s].map do |entity|
        result = OpenStruct.new
        entity.to_a.each do |key, value|
          result[key.to_sym] = OpenStruct.new(text: value["text"])
        end
        result
      end
    end
  end

  def format
    list = @data.dig("format") || []
    list.map do |f|
      OpenStruct.new(text: f, icon: FORMAT_ICONS[f])
    end
  end

  def main_author
    _map_field("main_author") do |ma|
      _author_browse_item(item: ma)
    end
  end

  def other_titles
    _map_field("other_titles") do |item|
      _link_to_item(item)
    end
  end

  def related_title
    _map_field("related_title") do |item|
      _link_to_item(item)
    end
  end

  def contributors
    _map_field("contributors") do |c|
      _author_browse_item(item: c)
    end
  end

  def call_number
    _map_field("call_number") do |item|
      _call_number_browse_item(item: item)
    end
  end

  def lcsh_subjects
    _map_field("lcsh_subjects") do |item|
      _subject_browse_item(item: item)
    end
  end

  def academic_discipline
    _map_field("academic_discipline") do |ad|
      disciplines = ad["list"].map do |d|
        OpenStruct.new(text: d, url: "#{S.base_url}/catalog?" + {query: "academic_discipline:#{d}"}.to_query)
      end
      OpenStruct.new(disciplines: disciplines)
    end
  end

  [:bookplate,
    :language, :oclc, :isbn,

    :gov_doc_no, :publisher_number,
    :report_number,

    :issn].each do |uid|
    define_method(uid) { _map_text_field(uid.to_s) }
  end

  def _map_text_field(uid)
    _map_field(uid) do |item|
      OpenStruct.new(text: item["text"])
    end
  end

  def _map_field(uid)
    list = @data.dig(uid) || []
    list.map do |item|
      yield(item)
    end
  end

  def _link_to_item(item)
    result = OpenStruct.new
    item.to_a.each do |key, value|
      query_string = value["search"].map do |x|
        "#{x["field"]}:\"#{x["value"]}\""
      end.join(" AND ")

      result[key.to_sym] = OpenStruct.new(
        text: value["text"],
        url: "#{S.base_url}/catalog?" + {query: query_string}.to_query
      )
    end
    result
  end

  def _subject_browse_item(item:)
    normalized_subject = item["text"].split(" -- ").join(" ")
    OpenStruct.new(
      text: item["text"],
      url: "#{S.base_url}/catalog?" + {query: "subject:\"#{normalized_subject}\""}.to_query,
      browse_url: "#{S.base_url}/catalog/browse/subject?" + {query: normalized_subject}.to_query,
      kind: "subject"
    )
  end

  def _call_number_browse_item(item:)
    OpenStruct.new(
      text: item["text"],
      browse_url: "#{S.base_url}/catalog/browse/callnumber?query=#{item["text"]}",
      kind: "call_number"
    )
  end

  def _author_browse_item(item:)
    result = OpenStruct.new
    item.to_a.each do |key, value|
      query_string = value["search"].map do |x|
        "#{x["field"]}:\"#{x["value"]}\""
      end.join(" AND ")

      result[key.to_sym] = OpenStruct.new(
        text: value["text"],
        url: "#{S.base_url}/catalog?" + {query: query_string}.to_query,
        browse_url: "#{S.base_url}/catalog/browse/author?" + {query: value["browse"]}.to_query,
        kind: "author"
      )
    end
    result
  end
end
