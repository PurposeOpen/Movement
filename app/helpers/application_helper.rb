module ApplicationHelper

  def conditionally_add_asterisk(string, should_add_asterisk)
    should_add_asterisk ? "#{string}*" : string
  end

  def render_footer_modules(action_content)
    if action_content.respond_to?(:footer_content_modules)
      @action_content.footer_content_modules.inject(''){|r, m| r << "<div>#{m.content}</div>"}.html_safe
    else
      ''
    end
  end

  def options_for_currency_dropdown(donation_module)
    default_currency = get_default_currency(donation_module)
    default_currency = default_currency.html_entity.to_s + default_currency.iso_code.to_s

    currencies = currencies_to_use(donation_module)
    render partial: 'actions/donations/currency_select', locals: {default_currency: default_currency, currencies: currencies }
  end

  def currencies_to_use(donation_module)
    suggested_amounts = donation_module.options.suggested_amounts.try(:attributes) && donation_module.options.suggested_amounts.attributes.count > 0 ?
                          donation_module.options.suggested_amounts :
                          donation_module.options.recurring_suggested_amounts.attributes.first[1]
    return suggested_amounts.attributes.keys
  end

  def get_default_currency(donation_module)
    default_currency = Money::Currency.new(donation_module.options.respond_to?(:default_currency) ?
                          donation_module.options.default_currency :
                          donation_module.options.recurring_default_currency.attributes.first[1])
    return default_currency
  end

  def options_for_amount(content_module)
    currencies = currencies_to_use(content_module)
    default_currency = get_default_currency(content_module)
    render partial: 'actions/donations/amount_options', locals: {default_currency: default_currency, currency_symbol: default_currency.html_entity.to_s, content_module: content_module, currencies: currencies}
  end

  def options_for_country_select
    countries = PurposeCountrySelect::COUNTRIES[I18n.locale.to_s]
    default_country = "USA"
    render partial: 'actions/donations/country_select', locals: {countries: countries, default_country: default_country}
  end

  def curve_background_image_unless_homepage
    unless content_for? :masthead
      border_radius_base = "border-radius: 0 0 50% 50% / 0 0 10% 10%;"
      "#{border_radius_base} -moz-#{border_radius_base} -webkit-#{border_radius_base}"
    end
  end

  def preview_javascript
    content_for :additional_js do
      concat(javascript_include_tag "lib/jquery.blockUI")
      concat(javascript_tag(
          "$.blockUI({
              message:null,
              overlayCSS:{cursor:'default', opacity: '0'}
          });"
      ))
    end
  end

end
