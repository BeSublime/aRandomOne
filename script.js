window.episodes = [];

var headings = [
  "Remember this one?",
  "Oh, this one is great!",
  "I love this one!"
];

var getEpisodes = function() {
  $.getJSON('/episodes.json', function(episodes) {
    console.info('Episodes loaded!', episodes);
    window.episodes = episodes;
  })
    .done(function() {
      init();
    })
    .fail(function() {
      $('.card').replaceWith('<button class="error" onClick="window.location.reload()">Error loading episodes, click here to reload.</button>');
    });
};

var randomItem = function(array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getRandomEpisode = function() {
  var season = randomItem(window.episodes),
      episode = randomItem(season.episodes);

  // add logic to make sure the first episode in 2-part episodes always comes first?

  console.log('random episode: ', season.season, episode);

  // Update the URLs
  $('.card a')
    .attr('href', 'https://www.netflix.com' + episode.urls.netflix)
    .eq(0).text('S' + season.season + ' E' + episode.episode + ' - ' + episode.title);
  
  // Update the header
  $('h1').text(randomItem(headings));
  
  // Update the elements for data tracking
  $('a, button', '.card').data({
    episode: episode.episode + ' - ' + episode.title,
    season: season.season
  });
  
  // TODO: Add episode descriptions to JSON and load them into card
};

// event tracking
var trackCardClick = function($target) {
  var action = $target.data('gaAction');
  var label  = $target.data('episode');
  var value  = $target.data('season');
  var event  = {
    'event_category': 'Card Click',
    'event_label': label, 
    'value': value
  };

  window.gtag('event', action, event);
};

// I don't love this name. What's better, or is there a better way to do this altogether?
var init = function() {
  getRandomEpisode();
  
  // Show the card if hidden
  $('.card.hidden').removeClass('hidden');
  
  // Bind UI handlers
  $('a, button', '.card').on('click', function() {
    trackCardClick($(this));
  });
  
  $('.card button').on('click', function() {
    getRandomEpisode();
  });
};

// All set, let's go!
$(function() {
  getEpisodes();
});
