import { Meteor } from 'meteor/meteor';
import Twit from 'twit';

import { Integrations } from '/imports/api/integrations/integrations';
import { KIND_CHOICES } from '/imports/api/integrations/constants';
import { Conversations } from '/imports/api/conversations/conversations';
import { Customers } from '/imports/api/customers/customers';
import { CONVERSATION_STATUSES } from '/imports/api/conversations/constants';

// get or create customer using twitter data
const getOrCreateCustomer = (integrationId, data) => {
  const customer = Customers.findOne({
    integrationId,
    'twitterData.id': data.user.id,
  });

  if (customer) {
    return customer._id;
  }

  const user = data.user;

  // create customer
  return Customers.insert({
    name: user.name,
    integrationId,
    twitterData: {
      id: user.id,
      idStr: user.id_str,
      name: user.name,
      screenName: user.screen_name,
      profileImageUrl: user.profile_image_url,
    },
  });
};

// save twit instances by integration id
const TwitMap = {};

export const trackTwitterIntegration = (integration) => {
  // Twit instance
  const twit = new Twit({
    consumer_key: Meteor.settings.TWITTER_CONSUMER_KEY,
    consumer_secret: Meteor.settings.TWITTER_CONSUMER_SECRET,
    access_token: integration.extraData.token,
    access_token_secret: integration.extraData.tokenSecret,
  });

  // save twit instance
  TwitMap[integration._id] = twit;

  // create stream
  const stream = twit.stream('user');

  // listen for timeline
  stream.on('tweet', Meteor.bindEnvironment((data) => {
    Conversations.insert({
      content: data.text,
      integrationId: integration._id,
      customerId: getOrCreateCustomer(integration._id, data),
      status: CONVERSATION_STATUSES.NEW,
    });
  }));

  // listen for direct messages
  stream.on('direct_message', Meteor.bindEnvironment(() => {}));
};

// track all twitter integrations for the first time
Integrations.find({ kind: KIND_CHOICES.TWITTER }).forEach((integration) => {
  trackTwitterIntegration(integration);
});

// post reply to twitter
export const tweetReply = (text, integration) => {
  const twit = TwitMap[integration._id];

  twit.post('statuses/update', { status: text });
};
