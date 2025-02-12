require "sinatra"
require "puma"
require "ostruct"
require_relative "lib/services"
require_relative "lib/search"

enable :sessions
set :session_secret, S.session_secret

datastores = Search::Presenters.datastores

before do
  subdirectory = request.path_info.split("/")[1]
  pass if ["auth", "session_switcher", "logout", "login", "-"].include?(subdirectory)

  if session[:logged_in].nil? || session[:logged_in] && session[:expires_at] < Time.now.to_i
    patron = Search::Patron.not_logged_in
    patron.to_h.each { |k, v| session[k] = v }
  end
  @patron = Search::Patron.from_session(session)

  S.logger.debug(session)
  @current_datastore = datastores.find { |datastore| datastore[:slug] == subdirectory }
  @datastores = datastores
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
