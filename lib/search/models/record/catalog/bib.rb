class Search::Models::Record::Catalog::Bib
  FORMAT_ICONS = YAML.load_file(File.join(S.config_path, "format_icons.yaml"))
  def initialize(data)
    @data = data
  end

  def title
    @data.dig("title", 0, "text")
  end

  def vernacular_title
    @data.dig("title", 1, "text")
  end

  def format
    list = @data.dig("format") || []
    list.map do |f|
      OpenStruct.new(text: f, icon: FORMAT_ICONS[f])
    end
  end

  def main_author
    ma = @data.dig("main_author", 0)
    _author_browse_item(item: ma) if ma
  end

  def vernacular_main_author
    vma = @data.dig("main_author", 1)
    _author_browse_item(item: vma) if vma
  end

  def other_titles
    _map_field("other_titles") do |item|
      _link_to_item(item: item, kind: title)
    end
  end

  def related_title
    _map_field("related_title") do |item|
      _link_to_item(item: item, kind: title)
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
      ad["list"]
    end
  end

  [:edition, :series, :series_statement, :note, :physical_description,
    :language, :published, :manufactured, :oclc, :isbn, :created, :biography_history,
    :in_collection, :terms_of_use, :date_place_of_event, :references,
    :copyright_status_information, :copyright, :playing_time, :audience,
    :production_credits, :bibliography, :gov_doc_no, :publisher_number,
    :report_number, :chronology, :place, :printer, :association, :distributed,
    :summary, :language_note].each do |uid|
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

  def _link_to_item(item:, kind:)
    OpenStruct.new(
      text: item["text"],
      url: "#{S.base_url}/catalog?" + {query: "title:#{item["search"]}"}.to_query
    )
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
    OpenStruct.new(
      text: item["text"],
      url: "#{S.base_url}/catalog?query=author:(\"#{item["search"]}\")",
      browse_url: "#{S.base_url}/catalog/browse/author?query=#{item["browse"]}",
      kind: "author"
    )
  end
end
