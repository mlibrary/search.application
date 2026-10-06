require "./app"

use Metrics::Middleware
use Rack::Deflater
use Rack::RubyProf, path: "/app/tmp/profile" if S.profile?
run Search::Application
