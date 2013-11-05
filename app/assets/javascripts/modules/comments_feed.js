var $Movement = $Movement || {};

(function($) {
  $.fn.commentsFeed = function(maxItemsInFeed) {
    return $(this).each(function() {
      return $Movement.commentsFeed.init(this, maxItemsInFeed);
    });
  }
})(jQuery);

$Movement.commentsFeed = (function() {
  var self = {};

  self.init = function(root, maxItemsInFeed) {
    self.root = $(root);
    self.emptySlots = self.maxItemsInFeed = maxItemsInFeed;
    self.commentsContainer = self.root.find('ul');
    self.feedPath = self.root.data("feed-path");
    self.lastFeedId = null;

    fetchFeed();
    setInterval(fetchFeed, 10000);
  };

  var fetchFeed = function() {
    $.get(self.feedPath).done(function(feeds) {
      var newFeeds = findNewFeeds(feeds);
      if (newFeeds.length > 0)  {
        self.root.show();
        self.lastFeedId = newFeeds[newFeeds.length - 1].id;
      }
      renderResponse(newFeeds);
    });
  };

  var findNewFeeds = function (feeds) {
    if(feeds.length == 0) return feeds;
    var arr = $.map(feeds, function (feed) {
      return feed.id;
    });
    return feeds.slice(arr.indexOf(self.lastFeedId) + 1, arr.size);
  };

  var renderResponse = function(feed) {
    if(isFirstResponse()) {
      feed = splice(feed);
    }
    
    var newItem = feed.shift();
    if (!newItem) return;

    render(newItem, function() {
      renderResponse(feed);
    });
  };

  function isFirstResponse() {
    return (self.emptySlots == self.maxItemsInFeed);
  }

  function splice(feed) {
    var max = self.maxItemsInFeed;
    return feed.splice(feed.length - max, max);
  }

  function render(newItem, callback) {
    var newFeedEntry = createFeedEntry(newItem).prependTo(self.commentsContainer);
    if (!hasEmptySlots()) {
      newFeedEntry.slideDown('slow', callback);
    }
    else {
      self.emptySlots--;
      newFeedEntry.show();
      !hasEmptySlots() && lockRootHeight();
      callback();
    }
  }

  function hasEmptySlots() {
    return (self.emptySlots > 0)
  }

  function lockRootHeight() {
    self.root.css('height', self.root.height());
  }

  function createFeedEntry(newItem) {
    var template = $('#recent_comment_template').html();
    newItem.country_iso && (newItem.country_iso = newItem.country_iso.toUpperCase());
    newItem.last_name = newItem.last_name.charAt(0) + '.';
    return $(Mustache.to_html(template, newItem)).hide();
  }

  return self;
})();
