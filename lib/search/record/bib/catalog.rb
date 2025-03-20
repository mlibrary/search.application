class Search::Record::Bib::Catalog
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
end
