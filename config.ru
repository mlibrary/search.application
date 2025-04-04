require "./app"
# require "yabeda/prometheus"
# require "prometheus/middleware/collector"

# Yabeda.configure!

# use Rack::Deflater
# use Prometheus::Middleware::Collector
use Metrics::Middleware
run Sinatra::Application
