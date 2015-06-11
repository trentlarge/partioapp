App.info({
  id: 'com.beta.partio',
  name: 'PARTIO',
  description: 'Lend. Borrow. Party-o',
  author: 'Codefyne',
  website: 'http://www.codefyne.com',
  version: '0.1.0'
});

App.icons({
  'iphone': 'public/Icon-76.png',
  'iphone_2x': 'public/Icon-60@2x.png',
  'iphone_3x': 'public/Icon-60@3x.png'
});

App.launchScreens({
  'iphone': '',
  'iphone5': ''
});

App.setPreference('StatusBarOverlaysWebView', true);
App.setPreference('StatusBarStyle', 'default');
App.accessRule('*');

App.configurePlugin('nl.x-services.plugins.launchmyapp', {
  URL_SCHEME: 'partioapp'
});