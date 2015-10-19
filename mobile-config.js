App.info({
  id: 'com.partioapp.partio',
  name: 'partiO',
  description: 'Share. Borrow. Party-o',
  author: 'InsaneInc',
  website: 'http://www.partioapp.com',
  version: '0.4.1'
});

App.icons({
  'iphone': 'public/Icon-76.png',
  'iphone_2x': 'public/Icon-60@2x.png',
  'iphone_3x': 'public/Icon-60@3x.png'
});

App.launchScreens({
  'iphone': 'public/Default~iphone.png',
  'iphone_2x': 'public/Default~iphone_640x960.png',
  'iphone5': 'public/Default@iphone5~iphone.png',
  'iphone6': 'public/Default@iphone6~iphone.png'

});

App.setPreference('StatusBarOverlaysWebView', false);
App.setPreference('StatusBarStyle', 'default');

// App.setPreference('StatusBarOverlaysWebView', false);
// App.setPreference('StatusBarBackgroundColor', '#263238');
// App.setPreference('HideKeyboardFormAccessoryBar', true);

App.accessRule('*');

// App.configurePlugin('nl.x-services.plugins.launchmyapp', {
//     URL_SCHEME: 'partioapp'
// });

App.configurePlugin('com.phonegap.plugins.facebookconnect', {
    APP_ID: '453646108150424',
    APP_NAME: 'partiO'
});
