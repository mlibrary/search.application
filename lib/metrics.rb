Bundler.require(:metrics)
require "prometheus/middleware/collector"
module Metrics
end

module Metrics::Yabeda
  def self.configure!
    Yabeda.configure do
      counter :datastore_request_count, comment: "Total number of requests to a datastore", tags: %i[datastore]
    end

    Yabeda.configure!
  end
end

class Metrics::Middleware < Prometheus::Middleware::Collector
  KNOWN_PATHS = ["/everything", "/catalog", "/articles", "/onlinejournals", "/guidesandmore", "/index.html"]
  APP_PATHS = ["/auth", "/login", "/logout"]

  protected

  def init_request_metrics
    @requests = @registry.counter(
      :"#{@metrics_prefix}_requests_total",
      docstring:
        "The total number of HTTP requests handled by the Rack application.",
      labels: %i[code method path]
    )
    @durations = @registry.histogram(
      :"#{@metrics_prefix}_request_duration_seconds",
      docstring: "The HTTP response duration of the Rack application.",
      labels: %i[method path],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10, 15, 20, 30]
    )
  end

  def init_exception_metrics
    @exceptions = @registry.counter(
      :"#{@metrics_prefix}_exceptions_total",
      docstring: "The total number of exceptions raised by the Rack application.",
      labels: [:exception]
    )
  end

  def strip_ids_from_path(path)
    p = super
    p.gsub!(%r{/record/[^/]+}, "/record/:record_id")
    return "/not-a-path" unless (KNOWN_PATHS + APP_PATHS).any? { |app_path| p.start_with?(app_path) }
    p
  end
end

module Metrics::PrometheusConfig
  class << self
    def configure_datastore
      data_store_dir = ENV.fetch("PROMETHEUS_MONITORING_DIR", "/tmp/metrics")
      Prometheus::Client.config.data_store =
        Prometheus::Client::DataStores::DirectFileStore.new(dir: data_store_dir)
    end

    def exporter_url
      ENV.fetch("PROMETHEUS_EXPORTER_URL", "tcp://0.0.0.0:9100/metrics")
    end
  end
end

module Metrics::PumaConfig
  class << self
    def control_app_url
      ENV.fetch("PUMA_CONTROL_APP", "tcp://0.0.0.0:9293")
    end

    def control_app_opts
      if ENV["PUMA_CONTROl_APP_TOKEN"]
        {auth_token: ENV["PUMA_CONTROL_APP_TOKEN"]}
      else
        {no_token: true}
      end
    end
  end
end
