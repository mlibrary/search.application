class Search::Presenters::Page
  class Static < self
    STATIC_PAGES = YAML.load_file(File.join(S.config_path, "static_pages.yaml"))
    ERROR_PAGES = YAML.load_file(File.join(S.config_path, "error_pages.yaml"))

    def self.slugs
      STATIC_PAGES.pluck("slug")
    end

    def self.for(slug:, uri:, patron:)
      page = (STATIC_PAGES + ERROR_PAGES).find { |x| x["slug"] == slug }
      new(slug: page["slug"], title: page["slug"], description: page["description"], datastore: :everything, uri: uri, patron: patron)
    end
  end
end
