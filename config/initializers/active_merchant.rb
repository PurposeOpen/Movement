Movement::Application.config.after_initialize do
  ActiveMerchant::Billing::Base.mode = :test
end