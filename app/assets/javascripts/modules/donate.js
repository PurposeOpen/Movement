var $Movement = $Movement || {};

$Movement.donate = {
  initialize: function () {

    // This code powers the .gradient-dropdowns and also updates the hidden inputs appropriately
    $('.gradient-dropdown.closed').on('click', function () {
      $(this).removeClass('closed');
    });
    $('.gradient-dropdown li').on('click', function (e) {
      e.stopPropagation();
      var $dropdown = $(this).parents('.gradient-dropdown');
      // Update the hidden input
      $dropdown.find('input').val(
        $(this).attr('data-value')
      );
      // Close the dropdown
      $dropdown.find('.closed').html( $(this).text() + "<div></div>" );
      $dropdown.addClass('closed');
      // Update the checkbox class
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      if ($(this).closest('.country').length > 0){
        if ($(this).attr('data-uses-postcode') === "true"){
          $("input[name='member_info[postcode]']").attr('required', 'true');
          $("input[name='member_info[postcode]']").show();
        } else{
          $("input[name='member_info[postcode]']").attr('required', false);
          $("input[name='member_info[postcode]']").hide();
        }
      }

    });

    $('#currency-dropdown li').on('click', function (e) {
      // Update the .amount <spans> w/ the right label
      var currency = $(this).attr("data-value");
      var pledge_type = $('.pledge_type input').attr('value');
      console.log("pledge_type:" + pledge_type)
      if (pledge_type == "true"){
        pledge_type = "monthly";
      } else {
        pledge_type = "onetime";
      }
      $('.suggested_amounts_wrapper :visible').find('*').andSelf().toggle();
      $('.amounts_for_currency_' + currency.toLowerCase() + '_' + pledge_type.toLowerCase()).find('*').andSelf().show();
      //setting the hidden field based on what item is visible
      $('#amount-hidden-input').val($('.amount.active :visible').parent().attr("data-value"));

    });

    $('.pledge_type li').on('click', function (e) {
      // Update the .amount <spans> w/ the right label
      var pledge_type = $('.pledge_type li.active').attr('data-value');
      if (pledge_type == "true"){
        pledge_type = "monthly";
      } else {
        pledge_type = "onetime";
      }
      var currency = $('#currency-dropdown input').attr('value');
      var amounts_to_show = '.amounts_for_currency_' + currency.toLowerCase() + '_' + pledge_type.toLowerCase();

      $('.suggested_amounts_wrapper :visible').find('*').andSelf().hide();
      $(amounts_to_show).find('*').andSelf().show();
      //$('.amount span').text( $(this).text()[0] );
    });

    // "Select an Amount" area and populates the hidden input appropriates
    $('.amount').on('click', function () {
      // Active State Background
      $('.amount').removeClass('active');
      $(this).addClass('active');
      // Reset free form input
      $('input.amount-input').val('').removeClass('active');
      // Update hidden input
      $('#amount-hidden-input').val( $(this).attr('data-value') );
    })
    $('input.amount-input').on('blur, click', function () {
      var value = parseInt( $(this).val() );
      if (isNaN(value)) { // Invalid Input
        $('.amount').first().click();
      } else { // Valid Input
        $(this).val( value );
        $('#amount-hidden-input').val( value );
        $('.amount :visible').removeClass('active');
        $(this).addClass('active');
      }
    });

    // Step Changing
    var currentStep = 1;
    var changeToStep = function (stepNumber) {
      $('.pledge').addClass('pledge-step-' + stepNumber)
                  .removeClass('pledge-step-' + currentStep);
      currentStep = stepNumber;
    }
    // Bind clicking (1) (2) (3) step circles
    $('.progress-bar .step').on('click', function () {
      var stepNumber = $(this).index() + 1;
      if(stepNumber == 2 && currentStep != 2){
        if ($("#pledge-step-1 input").valid() && $('#amount-hidden-input').attr("value") != "")
          if ($('.pledge').hasClass('existing-user'))
            changeToStep(3); // skip step 2
          else
            changeToStep(2);
      }else if(stepNumber == 3 && currentStep != 3){
        if($("#pledge-step-2 input").valid())
          changeToStep(3);
      }else if (stepNumber == 1 && currentStep != 1){
        changeToStep(1)
      }
    });

    // Bind each continue button except last, which submits
    $('#pledge-step-1 .button a').on('click', function () {
      if ($("#pledge-step-1 input").valid() && $('#amount-hidden-input').attr("value") != "")
        // if ($('.pledge').hasClass('existing-user'))
        //   changeToStep(3); // skip step 2
        // else
          changeToStep(2);
    });

    // $('#pledge-step-2 .button a').on('click', function () {
    //   if ($("#pledge-step-2 input").valid())
    //     changeToStep(3);
    // });
    // $('#pledge-step-3 .button a').on('click', function () {
    //   if ($("#pledge-step-3 input").valid())
    //     $('#pledge-form').submit();
    // });

    //setting the hidden field based on what item is visible
    $('#amount-hidden-input').val($('.amount.active :visible').parent().attr("data-value"));


    // Deal with < IE9 and other non-placeholder browsers
    (function($) {
      $.fn.placeholder = function() {
        if(typeof document.createElement("input").placeholder == 'undefined') {
          $('[placeholder]').focus(function() {
            var input = $(this);
            if (input.val() == input.attr('placeholder')) {
              input.val('');
              input.removeClass('placeholder');
            }
          }).blur(function() {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
              input.addClass('placeholder');
              input.val(input.attr('placeholder'));
            }
          }).blur().parents('form').submit(function() {
            $(this).find('[placeholder]').each(function() {
              var input = $(this);
              if (input.val() == input.attr('placeholder')) {
                input.val('');
              }
            })
          });
        }
      }
    })(jQuery);
    $.fn.placeholder();

    $('.paypal-info').bind("click", function(){
      var memberFieldMap = {
        email: {fieldWrapper : '#donation_form .field_wrapper.email', memberField: 'email' },
        first_name: {fieldWrapper : '#donation_form .field_wrapper.first_name', memberField: 'first_name' },
        last_name: {fieldWrapper : '#donation_form .field_wrapper.last_name', memberField: 'last_name' },
        country: {fieldWrapper : '#donation_form .field_wrapper.country', memberField: 'country_iso' },
        postcode: {fieldWrapper : '#donation_form .field_wrapper.postcode', memberField: 'postcode' }
      };

      var member_info = {};

      $.each(memberFieldMap, function (key, value) {
          var val = $(memberFieldMap[key].fieldWrapper).find(':input').val();
          if (val) {
              member_info[memberFieldMap[key].memberField] = val;
          }
      });
      $.cookie.json = true;
      $.cookie('member_info', member_info, { expires : 1 });


      // var rules = $("#action_info_card_number").rules("remove");

      // $("div#pledge-step-3 input").removeAttr("required");
      // $("#donation_form").validate({ignore: ".ignore"});
      // $("div#pledge-step-3 input").addClass("ignore");

      if($("#donation_form").valid()){
        $('#donation_form')[0].action = $('#donation_form').attr('data-setup-paypal-donation-action-path');
        $("#donation_form").submit();
      } 
      // else {
        // $("#action_info_card_number").rules("add", rules);
        // $("div#pledge-step-3 input").attr("required");
        // $("div#pledge-step-3 input").removeClass("ignore");
      // };
    })

    // $('#submit_button').bind("click", function(){
    //   $("#donation_form").submit();
    // });
  }
}