var $Movement = $Movement || {};

$Movement.taf = (function () {
  var self = {};

    function recordShare(share_url, page_id, user_id, share_type) {
      $.ajax(share_url, { type: "POST",
                          data: { page_id: page_id, user_id: user_id, share_type: share_type } }
      );
    }

    self.initializeTafSharing = function(params) {
      var share_url = params['share_url'];
      var page_id = params['page_id'];
      var user_id = params['user_id'];
      var fb_share_link = $('#fb_share_this');
      var twitter_submit_button = $('#twitter_submit_button')
      var email_submit_link = $('#email_link')

      fb_share_link.click(function () {
        recordShare(share_url, page_id, user_id, "facebook");
      });

      twitter_submit_button.click(function () {
        recordShare(share_url, page_id, user_id, "twitter");
        return true;
      });

      email_submit_link.click(function () {
        recordShare(share_url, page_id, user_id, "email");
      });
    }

  return self;
}) ();