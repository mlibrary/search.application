# add lib to load path so we can use "require"
$LOAD_PATH.unshift(File.dirname(__FILE__))

require "services"
require "yaml"
require "active_support"
require "sidekiq"
require "addressable"
require "addressable_extension"

module Search
end

require "search/helpers"
require "search/clients"
require "search/libraries"
require "search/datastores"
require "search/patron"
require "search/models"
require "search/presenters"
require "search/actions"
require "search/routes"
