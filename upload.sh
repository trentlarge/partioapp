#!/bin/sh

#creating install.sh
mkdir .temp/
#echo "#!/bin/bash
#tar -zxf /docker/partioapp/partioapp.tar.gz && echo 'Completed';" > .temp/install.sh;
#chmod +x .temp/install.sh;

#deploy
echo "PartiO upload bundle to '104.131.78.215";
echo "# Removing platforms to bundle it";
meteor remove-platform android ios
echo "Building.... ";
meteor build  --architecture os.linux.x86_64 .temp/
echo "Uploading bundle via SSH (make sure that your ssh key is on the server)...";
scp .temp/partioapp.tar.gz root@104.131.78.215:/docker/app/ &&
#scp .temp/install.sh root@104.131.78.215:/docker/partioapp/ &&
echo "Upload completed.";
git checkout .meteor/platforms
#ssh root@104.131.78.215 << .temp/install.sh &&
#echo "Ok. Removing temp files";
rm -rf .temp;
