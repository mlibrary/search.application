require "sinatra/base"
require_relative "search"
class Search::Application < Sinatra::Base
  module SearchHelpers
    include Search::ViewHelpers
  end
  helpers SearchHelpers
end
