# Be sure to restart your server when you modify this file.

# Your secret key is used for verifying the integrity of signed cookies.
# If you change this key, all old signed cookies will become invalid!

# Make sure the secret is at least 30 characters and all random,
# no regular words or you'll be exposed to dictionary attacks.
# You can use `rake secret` to generate a secure secret key.

# Make sure your secret_key_base is kept private
# if you're sharing your code publicly.
Movement::Application.config.secret_key_base = if Rails.env.development? or Rails.env.test?
  'ccdc4408446767e6431a9303641d1ff284287540c81af88d6fbf386c2db4c7f459cd6a201df54ce2e1b4366283aa1448d7b7a6cc0e7235c628ef26baf6ef0118'
else
  ENV['SECRET_TOKEN']
end