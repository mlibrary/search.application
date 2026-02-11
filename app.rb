require "sinatra/base"
require "sinatra/flash"
require "sinatra/namespace"
require "puma"
require "ostruct"
require_relative "lib/services"
require_relative "lib/search"
require_relative "lib/metrics"
require_relative "lib/sinatra_helpers"
require "debug" if S.app_env == "development"
require "ruby-prof" if S.profile?
Metrics::Yabeda.configure!

class Search::Application < Sinatra::Base
  configure do
    mime_type :ris, "application/x-research-info-systems"
  end

  set :root, S.project_root
  set :app_file, S.project_root + "/app.rb"

  enable :sessions
  register Sinatra::Flash
  register Sinatra::Namespace
  set :session_secret, S.session_secret

  S.logger.info("App Environment: #{settings.environment}")
  S.logger.info("Log level: #{S.log_level}")
  S.logger.info("Profiler on") if S.profile?

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
    @site_url = "#{request.scheme}://#{request.host_with_port}"
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
      session[:logged_in].nil? || session[:logged_in] == false
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
        erb :"partials/header/_login", locals: {text: "Log in"}
      end
    end
  end

  Search::Datastores.each do |datastore|
    get "/#{datastore.slug}" do
      headers "metrics.datastore" => datastore.slug, "metrics.route" => "static_page"
      Yabeda.datastore_request_count.increment({datastore: datastore.slug}, by: 1)
      @presenter = Search::Presenters.for_datastore(slug: datastore.slug, uri: URI.parse(request.fullpath), patron: @patron)
      erb :"datastores/layout", layout: :layout do
        erb :"datastores/#{datastore.slug}"
      end
    end
    if datastore.slug == "catalog"
      get "/#{datastore.slug}/record/:id" do
        # profile = RubyProf::Profile.new
        # profile.start
        headers "metrics.datastore" => datastore.slug, "metrics.route" => "full_record"
        @presenter = Search::Presenters.for_datastore_record(slug: datastore.slug, uri: URI.parse(request.fullpath), patron: @patron, record_id: params["id"])
        @record = @presenter.record
        erb :"datastores/record/layout", layout: :layout do
          erb :"datastores/record/#{datastore.slug}"
        end
        # result = profile.stop
        # printer = RubyProf::GraphHtmlPrinter.new(result)
        # printer.print(f)
        # File.open("profile.html", "w") do |f|
        #   printer.print(f)
        # end
      rescue Faraday::ResourceNotFound => error
        S.logger.error(error.message, error_response: error.response)
        redirect not_found
      end

      get "/#{datastore.slug}/record/:id/brief" do
        content_type :json
        Search::Presenters::Record.for_datastore(datastore: datastore.slug, id: params["id"], size: "brief").to_json
      end

      get "/#{datastore.slug}/record/:id/ris" do
        attachment "#{params["id"]}.ris"
        Search::Presenters::Record.for_datastore(datastore: datastore.slug, id: params["id"], size: "brief").ris
      rescue
        redirect "/#{datastore.slug}/record/:id"
      end

    end
    if datastore.slug == "everything"
      get "/#{datastore.slug}/list" do
        # headers "metrics.datastore" => datastore.slug, "metrics.route" => "list"
        @presenter = Search::Presenters.for_datastore_list(slug: datastore.slug, uri: URI.parse(request.fullpath), patron: @patron)
        erb :"datastores/list/layout", layout: :layout do
          erb :"datastores/list/#{datastore.slug}"
        end
      end
    end
  end

  Search::Presenters.static_pages.each do |page|
    get "/#{page[:slug]}" do
      headers "metrics.route" => "static_page"
      @presenter = Search::Presenters.for_static_page(slug: page[:slug], uri: URI.parse(request.fullpath), patron: @patron)
      erb :"pages/layout", layout: :layout do
        erb :"pages/#{page[:slug]}"
      end
    end
  end

  namespace "/actions" do
    post "/text" do
      content_type :json
      if not_logged_in_user?
        [403, {code: 403, message: "User must be logged in"}.to_json]
      else
        raise "Empty request body" unless request.body.size > 0
        request.body.rewind
        params = ActiveSupport::JSON.decode(request.body.read)
        data = Search::Actions::RecordsData.new(params["data"])
        Search::Actions::Text::Worker.perform_async(params["phone"], data.text_urls)
        [202, {code: 202, message: "We are sending your text message"}.to_json]
      end
    rescue => error
      S.logger.error("text_error", message: error.message, error_class: error.class)
      [500, {code: 500, message: "Something went wrong"}.to_json]
    end
    post "/email" do
      content_type :json
      if not_logged_in_user?
        [403, {code: 403, message: "User must be logged in"}.to_json]
      else
        raise "Empty request body" unless request.body.size > 0
        request.body.rewind
        params = ActiveSupport::JSON.decode(request.body.read)
        email = params["email"]
        data = params["data"]

        raise "invalid email address" unless email.match?(URI::MailTo::EMAIL_REGEXP)
        Search::Actions::Email::Worker.submit(email: email, data: data)
        [202, {code: 202, message: "We are sending your email"}.to_json]
      end
    rescue => error
      S.logger.error("email_error", message: error.message, error_class: error.class)
      [500, {code: 500, message: "Something went wrong"}.to_json]
    end
  end

  not_found do
    headers "metrics.route" => "not_found"
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

  if S.workshop?
    namespace "/dev" do
      # Email templates
      get "/email/record" do
        datastore, id = params["record"].split(",")

        @record = Search::Presenters::Record.for_datastore(datastore: datastore, id: id, size: "email")

        if params["content_type"] == "txt"
          content_type "text/plain"
          erb :"email/record", layout: :"email/record/txt"
        else
          erb :"email/record", layout: :"email/layout"
        end
      end
      get "/email/list" do
        @records = Hash.new { |hash, key| hash[key] = [] }
        params["record"].map do |r|
          datastore, id = r.split(",")
          @records[datastore].push Search::Presenters::Record.for_datastore(datastore: datastore, id: id, size: "email")
        end

        if params["content_type"] == "txt"
          content_type "text/plain"
          erb :"email/list", layout: :"email/list/txt"
        else
          erb :"email/list", layout: :"email/layout"
        end
      end
    end
  end
end
