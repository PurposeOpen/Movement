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
      $('#new_member_info').submit(function() {
        var street_address = $('#member_info_street_address').val() + ' ' + $('#member_info_postcode').val();
        var api_endpoint = $('#geotargeted_decisionmakers_action').data('apiEndpoint');

        $.ajax({
          type: "POST",
          beforeSend: function(xhr) {
            xhr.setRequestHeader('Access-Control-Expose-Headers', 'x-hello');
          },
          url: api_endpoint,
          data: {address: street_address},
          dataType: "json",
          success: function(data) {
            console.log('success');
            console.log(data);
            $('#geotargeted_decisionmakers').html(data);
          },
          error: function(data) {
            console.log('error');
            console.log(data);
            $('#geotargeted_decisionmakers').html(data);
          }
        })

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