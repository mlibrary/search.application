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
        indexing_date: "20250217",
        marc_record: {
          "leader": "01375nas a22003731  4500",
          "fields": [
            {
              "005": "20241217220537.0"
            },
            {
              "008": "880719d19662013enkqr p   o   0   a0eng d"
            },
            {
              "001": "990006758990106381"
            },
            {
              "022": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "0006-3665"
                  },
                  {
                    "0": "http://worldcat.org/issn/0006-3665"
                  }
                ]
              }
            },
            {
              "035": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "(MiU)000675899MIU01"
                  }
                ]
              }
            },
            {
              "035": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "(RLIN)MIUG101629-S"
                  }
                ]
              }
            },
            {
              "035": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "(CaOTULAS)160668009"
                  }
                ]
              }
            },
            {
              "035": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "(OCoLC)ocm02551528"
                  }
                ]
              }
            },
            {
              "040": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "CU-CU"
                  },
                  {
                    "c": "CU-CU"
                  },
                  {
                    "d": "NIC"
                  },
                  {
                    "d": "CtY"
                  },
                  {
                    "d": "MiU"
                  },
                  {
                    "d": "UtOrBLW"
                  }
                ]
              }
            },
            {
              "245": {
                "ind1": "0",
                "ind2": "0",
                "subfields": [
                  {
                    "a": "Birds."
                  }
                ]
              }
            },
            {
              "260": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "Sandy, Bedfordshire, Eng. :"
                  },
                  {
                    "b": "Royal Society for the Protection of Birds"
                  }
                ]
              }
            },
            {
              "300": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "v. :"
                  },
                  {
                    "b": "ill. ;"
                  },
                  {
                    "c": "28-30 cm"
                  }
                ]
              }
            },
            {
              "310": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "Quarterly"
                  },
                  {
                    "b": "Spring 1966-"
                  }
                ]
              }
            },
            {
              "321": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "Bimonthly,"
                  },
                  {
                    "b": "Jan./Feb. 1976"
                  }
                ]
              }
            },
            {
              "336": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "text"
                  },
                  {
                    "b": "txt"
                  },
                  {
                    "2": "rdacontent"
                  }
                ]
              }
            },
            {
              "337": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "unmediated"
                  },
                  {
                    "b": "n"
                  },
                  {
                    "2": "rdamedia"
                  }
                ]
              }
            },
            {
              "338": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "volume"
                  },
                  {
                    "b": "nc"
                  },
                  {
                    "2": "rdacarrier"
                  }
                ]
              }
            },
            {
              "362": {
                "ind1": "0",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "v. 1- Jan./Feb. 1966-"
                  }
                ]
              }
            },
            {
              "362": {
                "ind1": "1",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "Ceased publication with v.24 no.7 2013"
                  }
                ]
              }
            },
            {
              "500": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "\"Magazine of the Royal Society for the Protection of Birds.\""
                  }
                ]
              }
            },
            {
              "650": {
                "ind1": " ",
                "ind2": "0",
                "subfields": [
                  {
                    "a": "Birds"
                  },
                  {
                    "v": "Periodicals."
                  },
                  {
                    "0": "http://id.loc.gov/authorities/subjects/sh2007102031"
                  }
                ]
              }
            },
            {
              "710": {
                "ind1": "2",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "Royal Society for the Protection of Birds."
                  },
                  {
                    "0": "http://id.loc.gov/authorities/names/n80132329"
                  },
                  {
                    "1": "http://id.loc.gov/rwo/agents/n80132329"
                  },
                  {
                    "0": "http://viaf.org/viaf/135523524"
                  }
                ]
              }
            },
            {
              "780": {
                "ind1": "0",
                "ind2": "2",
                "subfields": [
                  {
                    "t": "Bird notes"
                  },
                  {
                    "g": "1903-65"
                  },
                  {
                    "x": "0406-3392"
                  }
                ]
              }
            },
            {
              "785": {
                "ind1": "0",
                "ind2": "0",
                "subfields": [
                  {
                    "t": "Nature's home"
                  },
                  {
                    "x": "2054-3433"
                  },
                  {
                    "w": "(DLC) 2013224081"
                  },
                  {
                    "w": "(OcoLC)863222856"
                  }
                ]
              }
            },
            {
              "908": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "AuthComplete 2024-12-16"
                  }
                ]
              }
            },
            {
              "958": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "MiU"
                  }
                ]
              }
            },
            {
              "959": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "(notis)ULACW8630"
                  }
                ]
              }
            },
            {
              "995": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "a": "20"
                  }
                ]
              }
            },
            {
              "998": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "c": "KK"
                  },
                  {
                    "s": "9121"
                  }
                ]
              }
            },
            {
              "BIB": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "u": "2025-01-03 23:13:42 US/Eastern"
                  },
                  {
                    "c": "2021-06-21 14:44:43 US/Eastern"
                  },
                  {
                    "s": "false"
                  }
                ]
              }
            },
            {
              "852": {
                "ind1": "0",
                "ind2": " ",
                "subfields": [
                  {
                    "b": "MUSM"
                  },
                  {
                    "a": "MiU"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "8": "22913504230006381"
                  }
                ]
              }
            },
            {
              "866": {
                "ind1": "3",
                "ind2": "2",
                "subfields": [
                  {
                    "a": "1-24"
                  },
                  {
                    "8": "22913504230006381"
                  }
                ]
              }
            },
            {
              "866": {
                "ind1": "3",
                "ind2": "2",
                "subfields": [
                  {
                    "a": "1966/1967-2013"
                  },
                  {
                    "8": "22913504230006381"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015019702078"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504160006381"
                  },
                  {
                    "z": "v.7-8 1978-81"
                  },
                  {
                    "r": "2002-08-06 06:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015042512437"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504140006381"
                  },
                  {
                    "z": "v.9 1982-83"
                  },
                  {
                    "r": "2002-08-06 06:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015019702060"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504180006381"
                  },
                  {
                    "z": "v.5-6 1974-77"
                  },
                  {
                    "r": "2002-07-24 06:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015072358081"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913503990006381"
                  },
                  {
                    "z": "v.23 2010-2011"
                  },
                  {
                    "r": "2019-05-22 06:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015019702045"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504200006381"
                  },
                  {
                    "z": "v.1-2 1966-69"
                  },
                  {
                    "r": "2002-08-06 06:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015061999291"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504000006381"
                  },
                  {
                    "z": "v.22 2008-2010"
                  },
                  {
                    "r": "2010-03-23 06:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015018662489"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504100006381"
                  },
                  {
                    "z": "v.12 1988-89"
                  },
                  {
                    "r": "1991-02-26 05:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015063505500"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913503980006381"
                  },
                  {
                    "z": "v.24 2012-2013"
                  },
                  {
                    "r": "2021-04-19 13:58:56 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015019702052"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504190006381"
                  },
                  {
                    "z": "v.3-4 1970-73"
                  },
                  {
                    "r": "2002-08-06 06:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015019702086"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504110006381"
                  },
                  {
                    "z": "v.11 1986-87"
                  },
                  {
                    "r": "2002-08-06 06:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015014271111"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504130006381"
                  },
                  {
                    "z": "v.10 1984-85"
                  },
                  {
                    "r": "2002-08-06 06:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015061356914"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504020006381"
                  },
                  {
                    "z": "v.20 2004-05"
                  },
                  {
                    "r": "2006-06-23 06:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015028677949"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504090006381"
                  },
                  {
                    "z": "v.13 1990-91"
                  },
                  {
                    "r": "1993-04-23 06:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015061912286"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504010006381"
                  },
                  {
                    "z": "v.21 2006-2007"
                  },
                  {
                    "r": "2008-02-11 05:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015052376814"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504030006381"
                  },
                  {
                    "z": "v.19 2002-03"
                  },
                  {
                    "r": "2004-04-30 06:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015042539869"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504060006381"
                  },
                  {
                    "z": "v.16 1996-97"
                  },
                  {
                    "r": "2001-10-08 06:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015042749575"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504050006381"
                  },
                  {
                    "z": "v.17 1998-99"
                  },
                  {
                    "r": "2001-02-02 05:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015028967381"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504080006381"
                  },
                  {
                    "z": "v.14 1992-93"
                  },
                  {
                    "r": "1994-06-27 06:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015042512601"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504040006381"
                  },
                  {
                    "z": "v.18 2000-01"
                  },
                  {
                    "r": "2002-08-27 06:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            },
            {
              "974": {
                "ind1": " ",
                "ind2": " ",
                "subfields": [
                  {
                    "8": "22913504230006381"
                  },
                  {
                    "f": "1"
                  },
                  {
                    "c": "BIR"
                  },
                  {
                    "m": "ISSUE"
                  },
                  {
                    "a": "39015037684480"
                  },
                  {
                    "e": "BIR"
                  },
                  {
                    "7": "23913504070006381"
                  },
                  {
                    "z": "v.15 1994-96"
                  },
                  {
                    "r": "1996-07-25 06:59:00 US/Eastern"
                  },
                  {
                    "h": "QL671 .B678"
                  },
                  {
                    "d": "MUSM"
                  },
                  {
                    "b": "MUSM"
                  }
                ]
              }
            }
          ]
        }
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
