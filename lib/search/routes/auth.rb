require "omniauth"
require "omniauth_openid_connect"

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
  session[:logged_in] = true
  session[:expires_at] = (Time.now + 24.hour).to_i
  S.logger.info(info)
  patron = Search::Patron.for(info[:nickname])
  patron.to_h.each { |k, v| session[k] = v }
  redirect session.delete(:path_before_login) || "/"
end

get "/auth/failure" do
  erb :"auth/failure"
end

get "/logout" do
  session.clear
  redirect "https://shibboleth.umich.edu/cgi-bin/logout?https://search.lib.umich.edu/"
end

get "/login" do
  <<~HTML
    <h1>Logging You In...<h1>
    <script>
      window.onload = function(){
        document.forms['login_form'].submit();
      }
    </script>
    <form id='login_form' method='post' action='/auth/openid_connect'>
      <input type="hidden" name="authenticity_token" value='#{request.env["rack.session"]["csrf"]}'>
      <noscript>
        <button type="submit">Login</button>
      </noscript>
    </form>
  HTML
end
