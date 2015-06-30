App.info({
  id: 'com.codefyne.parti-O',
  name: 'Parti-O',
  description: 'Share. Borrow. Party-o',
  author: 'Codefyne',
  website: 'http://www.codefyne.com',
  version: '0.1.2'
});

App.icons({
  'iphone': 'public/Icon-76.png',
  'iphone_2x': 'public/Icon-60@2x.png',
  'iphone_3x': 'public/Icon-60@3x.png'
});

App.launchScreens({
  'iphone': 'public/Default~iphone.png',
  'iphone5': 'public/Default@iphone5~iphone.png'
});

App.setPreference('StatusBarOverlaysWebView', true);
App.setPreference('StatusBarStyle', 'default');
App.accessRule('*');

App.configurePlugin('nl.x-services.plugins.launchmyapp', {
  URL_SCHEME: 'partioapp'
});

App.configurePlugin('com.phonegap.plugins.facebookconnect', {
    APP_ID: '453646108150424',
    APP_NAME: 'Parti-O'
});