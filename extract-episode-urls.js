/**
 * A quick chrome snippet to extract video ID's from an episode list on Netflix's website.
 * Use the jquerify bookmarklet before running this script: https://mreidsma.github.io/bookmarklets/jquerify.html
 * Execute on a page like https://www.netflix.com/title/70153404
 * You'll need to scroll through the episodes to ensure all are captured (it usually takes two runs.)
 *
 * @author Cory Evan Wright <coryevan@gmail.com>
 */
// $('.episodeWrapper div[data-ui-tracking-context]').each(function(i,el) { x.push($(el).data('uiTrackingContext')); });

var season = { // Using var instead of let so chrome doesn't balk when re-running the script
    season: parseInt($('a.sub-menu-link').text().match(/\d+/)[0]),
    episodes: []
};

$('.episodeWrapper div.episodeLockup').each(function(i, el) {
    const $episode = $(el),
          episode = {
            episode: parseInt($episode.find('.episodeNumber').text()),
            title: $episode.find('div.episodeTitle p').text(),
            urls: {
                netflix: $episode.find('a').attr('href').split('?')[0]
            }
          };

    season.episodes.push(episode);
});

copy(JSON.stringify(season, true, 4));
console.info('JSON copied to clipboard! Total: %s episodes.', season.episodes.length);