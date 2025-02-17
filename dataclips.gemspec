$:.push File.expand_path("../lib", __FILE__)

# Maintain your gem's version:
require "dataclips/version"

# Describe your gem and declare its dependencies:
Gem::Specification.new do |s|
  s.name        = "dataclips"
  s.version     = Dataclips::VERSION
  s.authors     = ["Tomasz Mazur"]
  s.email       = ["defkode@gmail.com"]
  s.homepage    = "https://github.com/defkode/dataclips"
  s.summary     = "Dataclips - shareable reports."
  s.description = "Heroku inspired dataclips for your application."
  s.license     = "MIT"

  s.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]
  s.test_files = Dir["test/**/*"]
  s.add_dependency "rails", ">= 6.1"
  s.add_dependency "pg"
  s.add_dependency "liquid"
end
