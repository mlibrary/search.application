class Search::Models::Results::Catalog < Search::Models::Results::Base
  LIBRARY_MAP = {
    "All libraries" => "all",
    "U-M Ann Arbor Libraries" => "aa",
    "Flint Thompson Library" => "flint",
    "Bentley Historical Library" => "bentley",
    "William L. Clements Library" => "clements",
    "all" => "all",
    "flint" => "flint",
    "bentley" => "bentley",
    "clements" => "clements"
  }

  def self.get_params(uri:, limit: nil, offset: nil)
    result = get_base_params(uri: uri, limit: limit, offset: offset)
    qh = uri.query_hash # duplicate values can be arrays
    library = LIBRARY_MAP[qh["library"]] || "aa"
    result[:filters].push("library:#{library}")
    result
  end
end
