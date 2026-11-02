class Search::Models::Record::Catalog::Citation
  def initialize(data)
    @data = data["citation"]
  end

  def meta_tags
    tagged.map do |entity|
      (entity["meta"] || []).map do |tag|
        {"name" => tag,
         "content" => entity["content"]}
      end
    end.flatten.compact
  end

  def ris
    tagged.map do |entity|
      (entity["ris"] || []).map do |tag|
        "#{tag}  - #{entity["content"]}"
      end
    end.flatten.compact.join("\n").strip
  end

  def csl
    @data&.dig("csl")
  end

  private

  def tagged
    @data["tagged"] || []
  end
end
