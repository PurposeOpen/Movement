module ActionsHelper
  Porpoise::ActionsHelper.class_eval do
    def render_partial_for(content_module, member)
      render :partial => partial_for(content_module), :locals => {:content_module => content_module, :member => member}
    end

    def partial_for(content_module)
      return 'disabled' if content_module.options.respond_to?(:active) and content_module.options.active == 'false'
      {
        "PetitionModule" => 'petition',
        "JoinModule" => 'join',
        "TellAFriendModule" => 'taf',
        "HtmlModule" => 'generic',
        "AccordionModule" => 'generic',
        "UnsubscribeModule" => 'unsubscribe',
        "DonationModule" => 'donation',
        "TaxDeductibleDonationModule" => 'donation',
        "NonTaxDeductibleDonationModule" => 'donation',
        "EmailTargetsModule" => 'email_targets',
        "GeotargetedDecisionmakersModule" => 'geotargeted_decisionmakers'
      }[content_module.type]
    end
  end
end