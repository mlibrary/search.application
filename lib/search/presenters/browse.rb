require "search/presenters/browse/titles"
require "search/presenters/browse/academic_discipline"

module Search::Presenters
  class Browse
    attr_reader :datastore

    def initialize(datastore:)
      @datastore = datastore
    end

    def has_browse?
      ["databases", "onlinejournals"].include?(@datastore)
    end

    def url
      "/#{@datastore}/browse"
    end

    def titles
      Search::Presenters::Browse::Titles.new(datastore: @datastore)
    end

    def academic_discipline
      Search::Presenters::Browse::AcademicDisciplines.new(datastore: @datastore)
    end
  end
end
