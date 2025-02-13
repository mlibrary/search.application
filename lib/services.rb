require "canister"
require "alma_rest_client"

Services = Canister.new

S = Services

AlmaRestClient.configure do |config|
  config.alma_api_key = ENV["ALMA_API_KEY"] || "your_alma_api_key"
end

S.register(:app_env) { ENV["APP_ENV"] || "development" }
S.register(:version) { ENV["APP_VERSION"] || `git rev-parse HEAD` }
S.register(:session_secret) { ENV["SESSION_SECRET"] || "session_secret_this_is_extra_text_so_that_it_is_32_bytes_aaaaaaa" }
S.register(:project_root) do
  File.absolute_path(File.join(__dir__, ".."))
end
S.register(:config_path) do
  File.join(S.project_root, "config")
end

S.register(:oidc_issuer) { ENV["OIDC_ISSUER"] }
S.register(:oidc_client_id) { ENV["OIDC_CLIENT_ID"] }
S.register(:oidc_client_secret) { ENV["OIDC_CLIENT_SECRET"] }

S.register(:base_url) { ENV["BASE_URL"] || "http://localhost:4567" }

S.register(:logger) { Logger.new($stdout) }
