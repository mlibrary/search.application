require "sinatra"
require "puma"
require "ostruct"
require_relative "lib/services"
require_relative "lib/search"

enable :sessions
set :session_secret, S.session_secret

datastores = Search::Presenters.datastores

before do
  @current_datastore = datastores.find { |datastore| datastore[:slug] == request.path_info.split("/")[1] }
  @datastores = datastores
  @patron = OpenStruct.new(
    email: "",
    sms: "",
    affiliation: "aa", # flint || aa
    logged_in?: false
  )
end

get "/" do
  redirect to("/everything")
end

datastores.each do |datastore|
  get "/#{datastore[:slug]}" do
    @presenter = Search::Presenters.for_datastore(datastore[:slug])
    erb :"datastores/layout", layout: :layout do
      erb :"datastores/#{datastore[:slug]}"
    end
  end
end

Search::Presenters.static_pages.each do |page|
  get "/#{page[:slug]}" do
    @presenter = Search::Presenters.for_static_page(page[:slug])
    erb :"pages/layout", layout: :layout do
      erb :"pages/#{page[:slug]}"
    end
  end
end

not_found do
  @presenter.title = "404 - Page not found"
  status 404
  erb :"errors/404"
end
