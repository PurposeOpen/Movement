Movement::Application.configure do
  config.less.paths << "#{Rails.root}/app/assets/stylesheets/lib/bootstrap/"
  config.less.compress = true
end