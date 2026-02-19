/**
 * 🎵 Tumburu — X/Twitter management skill.
 * Named after Tumburu, the celestial musician who entertains the gods.
 * @module skills/tumburu
 */

const TWEET_MAX = 280;
const THREAD_MAX = 25;

/**
 * Compose a tweet optimized for engagement.
 * @param {string} content - Raw content idea
 * @param {object} opts - Options (hashtags, thread, tone)
 * @returns {object} Formatted tweet(s)
 */
export function composeTweet(content, opts = {}) {
  const { hashtags = [], tone = 'casual', asThread = false } = opts;

  if (!asThread && content.length <= TWEET_MAX) {
    const tagStr = hashtags.length > 0 ? '\n\n' + hashtags.map(t => `#${t}`).join(' ') : '';
    const tweet = content + tagStr;
    return {
      type: 'single',
      tweets: [tweet.slice(0, TWEET_MAX)],
      charCount: tweet.length,
    };
  }

  // Split into thread
  const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
  const tweets = [];
  let current = '';

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if ((current + ' ' + trimmed).length > TWEET_MAX - 10) {
      if (current) tweets.push(current.trim());
      current = trimmed;
    } else {
      current = current ? current + ' ' + trimmed : trimmed;
    }
  }
  if (current) tweets.push(current.trim());

  // Add thread numbering
  const numbered = tweets.slice(0, THREAD_MAX).map((t, i) => `${i + 1}/${tweets.length} ${t}`);

  return {
    type: 'thread',
    tweets: numbered,
    tweetCount: numbered.length,
  };
}

/**
 * Suggest optimal posting times based on general engagement data.
 * @param {string} timezone - User timezone
 * @returns {string[]} Suggested times
 */
export function suggestPostingTimes(timezone = 'America/New_York') {
  return [
    '8:00 AM - Morning commute',
    '12:00 PM - Lunch break',
    '5:00 PM - End of workday',
    '8:00 PM - Evening scroll',
  ];
}

/**
 * Generate hashtag suggestions for a topic.
 * @param {string} topic - Content topic
 * @returns {string[]} Suggested hashtags
 */
export function suggestHashtags(topic) {
  const words = topic.toLowerCase().split(/\s+/);
  const tags = words.filter(w => w.length > 3).slice(0, 5);
  return tags;
}

export async function execute(context) {
  const { input, config = {} } = context;
  const result = composeTweet(input, config);
  return { success: true, skill: 'tumburu', ...result };
}

export default { execute, composeTweet, suggestPostingTimes, suggestHashtags };
