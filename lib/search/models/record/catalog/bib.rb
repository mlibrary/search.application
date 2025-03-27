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
    _browse_item(item: ma, kind: "author") if ma
  end

  def vernacular_main_author
    vma = @data.dig("main_author", 1)
    _browse_item(item: vma, kind: "author") if vma
  end

  def other_titles
    _map_field("other_titles") do |item|
      _link_to_item(item: item, kind: title)
    end
  end

  def contributors
    _map_field("contributors") do |c|
      _browse_item(item: c, kind: "author")
    end
  end

  def academic_discipline
    _map_field("academic_discipline") do |ad|
      ad["list"]
    end
  end

  [:edition, :series, :series_statement, :note, :physical_description,
    :language, :published, :manufactured, :oclc, :isbn, :call_number,
    :lcsh_subjects].each do |uid|
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

  def _browse_item(item:, kind:)
    OpenStruct.new(
      text: item["text"],
      url: "#{S.base_url}/catalog?query=#{kind}:(\"#{item["search"]}\")",
      browse_url: "#{S.base_url}/catalog/browse/#{kind}?query=#{item["browse"]}",
      kind: kind
    )
  end
end
