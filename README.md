
FOR LOCALHOST TESTING
- meteor run --settings settings-dev.json

Sample Debit Card:
5200 8282 8282 8210

Sample Credit Card:
4242 4242 4242 4242 

BUILD
- meteor build [dir] --server https://[version].partiodemo.com --mobile-settings settings.json

Build Android
- cd [dir]
- jarsigner -digestalg SHA1 release-unsigned.apk partioapp 
- [android-sdk-dir]/build-tools/[build-tools-vr]/zipalign 4 release-unsigned.apk partioapp-release-signed.apk

DEPLOY SERVER (ssh key must exists on server)
- mupx deploy

Logs
- mpux logs -f

SSL - how to create and configure new SLL server for a new version - 
Using how example vr v1-5-5
- On server, just install the openssl (yum install openssl openssl-devel)
- On your code, create a new dir v1-5-5.partiodemo.com inside ssl folder, go to folder and run:
- openssl req -newkey rsa:2048 -nodes -keyout v1-5-5.partiodemo.com.key -out v1-5-5.partiodemo.com.csr
- Copy the .csr file code and past on startssl.com (certificates wizard)
- You must validate a domain with same vr: v1-5-5.partiodemo.com
- After validation, download the certificate (v1-5-5.partiodemo.com.zip) from site and save on ./ssl/v1-5-5.partiodemo.com
- Open the zip file and the NginxServer.zip inside. Copy 1_v1-5-5.partiodemo.com_bundle.crt to ./ssl/v1-5-5...
- Edit the mup.json file, updating the informations on SSL node.
