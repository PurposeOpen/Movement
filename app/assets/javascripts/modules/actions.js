var $Movement = $Movement || {};

$Movement.actions = {
  show: function() {
    $('#member_info_country_iso').selectBox();

    initializeActionCounter();

    $Movement.validations.hookValidationsTo($('#new_member_info'));

    initializeCharCounterForComments();

    if($('body').attr('data-enable-activity-feed') == 'true') {
      initializeCommentsFeed();
    };

    $('#share_options').each(function() {
      var share_url = $(this).attr('data-share-url');
      var page_id = $(this).attr('data-page-id');
      var user_id = $(this).attr('data-user-id');

      $Movement.taf.initializeTafSharing({share_url: share_url, page_id: page_id, user_id: user_id});
    });

    $('#donate-widget').each(function() {
      $Movement.donate.initialize();
    });

    $('#geotargeted_decisionmakers_action').each(function() {
      setUpGeotargetedRepresentatives();
    });


    function setUpGeotargetedRepresentatives() {
      gapi.client.setApiKey($('#geotargeted_decisionmakers_action').data('apiKey'));

      $('#new_member_info').submit(function() {
        if($(this).valid()) {

          $.ajax({
            type: 'POST',
            url: $(this).attr('action'),
            data: $(this).serialize()
          });

          var street_address = $('#member_info_street_address').val() + ' ' + $('#member_info_postcode').val();
          var req = gapi.client.request({
              'path' : '/civicinfo/us_v1/representatives/lookup',
              'method' : 'POST', // Required. The API does not allow GET requests.
              'body' : {'address' : street_address}
          });

          req.execute(function(response, rawResponse) {
            api_response = response;
            console.log(response);
            $('#geotargeted_decisionmakers').html(rawResponse);
          });

          return false;
        }

        return false;
      });
    }

    function initializeCharCounterForComments() {
      var commentArea = $('#action_info_comment');
      var maxlength = commentArea.attr('maxlength');
      commentArea.charCount({allowed: maxlength});
    }

    function initializeActionCounter() {
      var complete = $('#petition_counter #a_mid');
      var initial_complete_width = $('#petition_counter #a_mid').width();
      var complete_count = parseInt($('#action_count').text());
      var goal = parseInt($('#goal_number').text());
      var progress, totalSize;

      if (complete_count > goal) {
        progress = 1;
      } else {
        progress = complete_count / goal;
      }
      totalSize = $("#b_mid").width() - $("#a_start").width() - $("#joint").width();
      var complete_width = Math.floor(totalSize * progress);
      if (complete_width > initial_complete_width) {
        complete.animate({width:complete_width}, 1750, "linear");
      }
    }

    function initializeCommentsFeed() {
      $('.comments_feed').commentsFeed(5);
    }
  },

  preview: function() {
    $('#member_info_country_iso').selectBox();
  },

  return_from_paypal: function() {
    $("#return-from-paypal-interstitial").each(function() {
      $(".interstitial-no-js").hide();
      $(".interstitial").show();
      $(".interstitial").removeClass("hidden");

      member_info_cookie = $.cookie('member_info');
      if (member_info_cookie) {
          $.each($.parseJSON(member_info_cookie), function(key, val){
              $('<input>', { type: 'hidden', name: 'member_info[' + key + ']', value: val }).appendTo("#complete_paypal_donation_form");
          });
      }

      $("#complete_paypal_donation_form").submit();
    });
  }
}