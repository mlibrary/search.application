require "sinatra"
require "puma"
require "ostruct"
require_relative "lib/services"
require_relative "lib/search"

enable :sessions
set :session_secret, S.session_secret

datastores = Search::Presenters.datastores
S.logger.info("log level: #{S.log_level}")
before do
  subdirectory = request.path_info.split("/")[1]

  pass if ["auth", "session_switcher", "logout", "login", "-"].include?(subdirectory)

  if new_user? || expired_user_session?
    patron = Search::Patron.not_logged_in
    patron.to_h.each { |k, v| session[k] = v }
    session.delete(:expires_at)
  end
  @patron = Search::Patron.from_session(session)

  S.logger.debug("here's the session", session.to_h)
  @current_datastore = datastores.find { |datastore| datastore[:slug] == subdirectory }
  @datastores = datastores
end

helpers do
  #
  # A new user is someone who doesn't have any session variables set.
  #
  # @return [Boolean]
  #
  def new_user?
    session[:logged_in].nil?
  end

  #
  # A session state where logged_in is true and expires_at is in the past
  #
  # @return [Boolean] <description>
  #
  def expired_user_session?
    session[:logged_in] && session[:expires_at] < Time.now.to_i
  end
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
