require_relative "../lib/metrics"

# data_store_dir = ENV.fetch("PROMETHEUS_MONITORING_DIR", "/tmp/metrics")
# Prometheus::Client.config.data_store =
#   Prometheus::Client::DataStores::DirectFileStore.new(dir: data_store_dir)

# control_app_url = ENV.fetch("PUMA_CONTROL_APP", "tcp://0.0.0.0:9293")

# control_app_opts = {}
# if ENV["PUMA_CONTROl_APP_TOKEN"]
#   control_app_opts[:auth_token] = ENV["PUMA_CONTROL_APP_TOKEN"]
# else
#   control_app_opts[:no_token] = true
# end
Metrics::PrometheusConfig.configure_datastore

activate_control_app(Metrics::PumaConfig.control_app_url, Metrics::PumaConfig.control_app_opts)
plugin :yabeda
plugin :yabeda_prometheus # This sets up metrics on port 9394
prometheus_exporter_url(Metrics::PrometheusConfig.exporter_url)
