
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
- [android-sdk-dir]/build-tools/23.0.2/zipalign 4 release-unsigned.apk partioapp-release-signed.apk

DEPLOY SERVER (ssh key must be on server)
- mupx deploy

Logs
- mpux logs -f

SSL new version
- openssl req -newkey rsa:2048 -nodes -keyout [version].partiodemo.com.key -out [version].partiodemo.com.csr
