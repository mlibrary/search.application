require "sinatra"
require "puma"
require "ostruct"
require_relative "lib/services"
require_relative "lib/search"
require "debug" if S.app_env == "development"
require_relative "lib/sinatra_helpers"

enable :sessions
set :session_secret, S.session_secret
S.logger.info("App Environment: #{settings.environment}")
S.logger.info("Log level: #{S.log_level}")

before do
  subdirectory = request.path_info.split("/")[1]

  pass if ["auth", "change-affiliation", "logout", "-"].include?(subdirectory)
  pass if subdirectory == "session_switcher" && S.dev_login?
  if expired_user_session?
    patron = Search::Patron.not_logged_in
    patron.to_h.each { |k, v| session[k] = v }
    session[:expires_at] = (Time.now + 1.hour).to_i
  end
  @patron = Search::Patron.from_session(session)

  session[:path_before_form] = request.url

  S.logger.debug("here's the session", session.to_h)
  @datastores = Search::Datastores.all
  @libraries = Search::Libraries
end

if S.dev_login?
  get "/session_switcher" do
    patron = Search::Patron.for(uniqname: params[:uniqname], session_affiliation: nil)
    patron.to_h.each { |k, v| session[k] = v }
    session[:expires_at] = (Time.now + 1.day).to_i
    redirect back
  end
end

helpers do
  #
  # A new user is someone who doesn't have any session variables set.
  #
  # @return [Boolean]
  #
  def not_logged_in_user?
    session[:logged_in].nil?
  end

  #
  # A session state where logged_in is true and expires_at is in the past
  #
  # @return [Boolean] <description>
  #
  def expired_user_session?
    session[:expires_at].nil? || session[:expires_at] < Time.now.to_i
  end
end

get "/" do
  redirect to("/everything")
end

helpers do
  def login
    if @patron.logged_in?
      link_to(body: "Log out", url: "/logout", classes: ["underline__none"])
    else
      <<-HTML
        <form id="login_form" method="post" action="/auth/openid_connect">
          <input type="hidden" name="authenticity_token" value="#{request.env["rack.session"]["csrf"]}">
          <button type="submit">Log in</button>
        </form>
      HTML
    end
  end
end

Search::Datastores.each do |datastore|
  get "/#{datastore.slug}" do
    @presenter = Search::Presenters.for_datastore(slug: datastore.slug, uri: URI.parse(request.fullpath), patron: @patron)
    erb :"datastores/layout", layout: :layout do
      erb :"datastores/#{datastore.slug}"
    end
  end
  if datastore.slug == "catalog"
    get "/#{datastore.slug}/record/:mms_id" do
      @presenter = Search::Presenters.for_datastore_record(slug: datastore.slug, uri: URI.parse(request.fullpath), patron: @patron)
      @record = OpenStruct.new(
        title: "This is a title",
        metadata: [
          OpenStruct.new(
            field: "Contributors",
            data: [
              OpenStruct.new(
                partial: "browse",
                locals: OpenStruct.new(
                  text: "This is a contributor",
                  url: 'http://search.lib.umich.edu/catalog/author:("This is a contributor")',
                  browse_url: "http://search.lib.umich.edu/catalog/browse/author/This+is+a+contributor",
                  kind: "author"
                )
              )
            ]
          )
        ],
        indexing_date: "20250217"
      )
      # content_type :json
      @record.to_json
      erb :"datastores/record/layout", layout: :layout do
        erb :"datastores/record/#{datastore.slug}"
      end
    end
  end
end

Search::Presenters.static_pages.each do |page|
  get "/#{page[:slug]}" do
    @presenter = Search::Presenters.for_static_page(slug: page[:slug], uri: URI.parse(request.fullpath), patron: @patron)
    erb :"pages/layout", layout: :layout do
      erb :"pages/#{page[:slug]}"
    end
  end
end

not_found do
  @presenter = Search::Presenters.for_404_page(uri: URI.parse(request.fullpath), patron: @patron)
  status 404
  erb :"errors/404"
end

post "/change-affiliation" do
  session[:affiliation] = if session[:affiliation].nil?
    "flint"
  end
  redirect session.delete(:path_before_form) || "/"
end

post "/search" do
  # TODO: Keep `library` query parameter on `catalog` datastore when making a search.
  # Sending both parameters to current site erases the `library` parameter.
  option = params[:search_option]
  query = URI.encode_www_form_component(params[:search_text])
  if option != "keyword"
    # The query gets wrapped if the selected search option is not `keyword`
    query = "#{option}:(#{query})"
  elsif query.empty?
    # Redirect to landing page if query is empty and search option is `keyword`
    redirect "/#{params[:search_datastore]}"
  end
  # Make a search in the current site
  redirect "https://search.lib.umich.edu/#{params[:search_datastore]}?query=#{query}"
end
