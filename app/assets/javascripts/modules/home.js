var $Movement = $Movement || {};

$Movement.home = {
  index: function() {
    $Movement.validations.hookValidationsTo($('#remote_join'));

    $('.carousel').carousel();

    $('.recent_actions').activityFeed(4);
  }
}