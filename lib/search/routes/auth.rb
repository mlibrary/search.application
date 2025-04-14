require "omniauth"
require "omniauth_openid_connect"

class Search::Application < Sinatra::Base
  use OmniAuth::Builder do
    provider :openid_connect, {
      issuer: S.oidc_issuer,
      discovery: true,
      client_auth_method: "jwks",
      scope: [:openid, :profile, :email],
      client_options: {
        identifier: S.oidc_client_id,
        secret: S.oidc_client_secret,
        redirect_uri: "#{S.base_url}/auth/openid_connect/callback"
      }
    }
  end

  get "/auth/openid_connect/callback" do
    auth = request.env["omniauth.auth"]
    info = auth[:info]
    patron = Search::Patron.for(uniqname: info[:nickname], session_affiliation: session[:affiliation])
    session[:logged_in] = true
    session[:expires_at] = (Time.now + 24.hour).to_i
    S.logger.debug("oidc info", info)
    patron.to_h.each { |k, v| session[k] = v }
    redirect session.delete(:path_before_form) || "/"
  end

  get "/logout" do
    session.clear
    redirect "https://shibboleth.umich.edu/cgi-bin/logout?https://search.lib.umich.edu/"
  end
end
