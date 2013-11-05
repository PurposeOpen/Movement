var $Movement = $Movement || {};

(function($) {
  $.fn.activityFeed = function(maxItemsInFeed) {
    return $(this).each(function() {
      feed = $Movement.initActivityFeed(this, maxItemsInFeed, $('#recent_action_template'));
      return feed.start();
    });
  }
})(jQuery);

$Movement.initActivityFeed = function(root, maxItemsInFeed, templateElement) {
  var self = {};

  self.root = $(root);
  self.emptySlots = maxItemsInFeed;
  self.feedPath = self.root.data("feed-path");
  self.template = templateElement.html();
  self.slider = self.root.find(".slider");
  self.lastFeedId = null;

  self.start = function () {
    fetchFeed();
    setInterval(fetchFeed, 10000);
  };

  self.createFeedEntry = function(newItem) {
    var message = $('<p>').append(newItem.html);
    var actionLink = message.find("a");
    if (actionLink.length) {
      var actionUrl = "/" + $("body").data("locale") + "/actions/" + actionLink.data("page-name");
      actionLink.attr("href", actionUrl);
    }
    
    newItem.html = message.html();
    
    return $(Mustache.to_html(self.template, newItem));
  };

  var fetchFeed = function() {
    $.get(self.feedPath).done(function (feeds) {
      var newFeeds = findNewFeeds(feeds);
      if (newFeeds.length > 0)  {
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

  var fadeOldestItem = function(callback) {
    if (self.emptySlots <= 0) {
      self.slider.children().first().delay(2000).animate({ opacity: 0 }, 300, function() { callback($(this)); } );
    } else {
      callback();
    }
  };

  var slideNewItem = function(newItem, callback) {
    var feedEntry = self.createFeedEntry(newItem);
    feedEntry.appendTo(self.slider);
    
    var currentMargin = parseInt(self.slider.css('margin-right'));
    var newMargin = currentMargin - feedEntry.outerWidth(true);

    if (self.emptySlots <= 0) {
      self.slider.animate({ 'margin-right': newMargin }, 1000, callback);
    } else {
      self.emptySlots--;
      callback();
    }
  };

  var renderResponse = function(feed) {
    var newItem = feed.shift();
    if (!newItem) return;
    fadeOldestItem(function(oldestItem) { 
      slideNewItem(newItem, function() {
        if (oldestItem) {
          oldestItem.remove();
          self.slider.css('margin-right', 0);
          renderResponse(feed);
        } else {
          renderResponse(feed);
        }
      });
    });
  };

  return self;
};
