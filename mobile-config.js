App.info({
  id: 'com.partio.partiobeta',
  name: 'partiO',
  description: 'Share. Borrow. Party-o',
  author: 'partiO',
  website: 'http://www.partioapp.com',
  version: '1.4',
  buildNumber: '101' 
});

App.icons({
  'iphone': 'public/icons/ios/Icon-76.png',
  'iphone_2x': 'public/icons/ios/Icon-60@2x.png',
  'iphone_3x': 'public/icons/ios/Icon-60@3x.png',
  'ipad': 'public/icons/ios/Icon-76.png',
  'ipad_2x': 'public/icons/ios/Icon-76@2x.png',
  'android_ldpi': 'public/icons/android/ic_launcher36x36.png',
  'android_mdpi': 'public/icons/android/ic_launcher48x48.png',
  'android_hdpi': 'public/icons/android/ic_launcher72x72.png',
  'android_xhdpi': 'public/icons/android/ic_launcher96x96.png'
});

App.launchScreens({
  // 'iphone': 'public/Default~iphone.png',
  // 'iphone_2x': 'public/Default~iphone_640x960.png',
  // 'iphone5': 'public/Default@iphone5~iphone.png',
  // 'iphone6': 'public/Default@iphone6~iphone.png'
  // iOS
  'iphone': 'public/launchScreens/320x480.png',
  'iphone_2x': 'public/launchScreens/320x480@2x.png',
  'iphone5': 'public/launchScreens/320x568@2x.png',
  'iphone6': 'public/launchScreens/375x667@2x.png',
  'iphone6p_portrait': 'public/launchScreens/414x736@3x.png',
  'iphone6p_landscape': 'public/launchScreens/736x414@3x.png',

  'ipad_portrait': 'public/launchScreens/768x1024.png',
  'ipad_portrait_2x': 'public/launchScreens/768x1024@2x.png',
  'ipad_landscape': 'public/launchScreens/1024x768.png',
  'ipad_landscape_2x': 'public/launchScreens/1024x768@2x.png',

  // Android
  'android_ldpi_portrait': 'public/launchScreens/200x320.png',
  'android_ldpi_landscape': 'public/launchScreens/320x200.png',
  'android_mdpi_portrait': 'public/launchScreens/320x480.png',
  'android_mdpi_landscape': 'public/launchScreens/480x320.png',
  'android_hdpi_portrait': 'public/launchScreens/480x800.png',
  'android_hdpi_landscape': 'public/launchScreens/800x480.png',
  'android_xhdpi_portrait': 'public/launchScreens/720x1280.png',
  'android_xhdpi_landscape': 'public/launchScreens/1280x720.png'


});


App.setPreference('StatusBarOverlaysWebView', true);
App.setPreference('StatusBarStyle', 'lightcontent');
App.setPreference('AllowInlineMediaPlayback', true);

// App.setPreference('StatusBarOverlaysWebView', false);
// App.setPreference('StatusBarBackgroundColor', '#263238');
// App.setPreference('HideKeyboardFormAccessoryBar', true);

App.accessRule('*');

// App.configurePlugin('nl.x-services.plugins.launchmyapp', {
//     URL_SCHEME: 'partioapp'
// });

// App.configurePlugin('com.phonegap.plugins.facebookconnect', {
//     APP_ID: '902012053186141',
//     APP_NAME: 'partiO'
// });
