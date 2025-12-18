# Discord-Autocreate-Servers
This bot creates Discord servers automatically using the NPM library "discordjs-selfbot-v13"

## So how do I use it?
The prerequisites to using this bot is having NPM / Node installed, and apart from the prerequisites, the following also need to be added using npm:

discord.js-selfbot-v13@3.6.1
https-proxy-agent@7.0.6
node-fetch@2.7.0
proxy-agent@6.5.0

After everything is done and installed, you may alter "app.js" and add any proxy if you want to use that under the "PROXY_URL" variable. For TEMPLATE_URL, you'll want to insert your own Discord server template URL. In tokens.txt, put in the tokens of the Discord accounts that you want to create the servers. The server IDs will be outputted to a file by the name of "createdGuilds.txt" in the same directory. Lastly, ICON_BUFFER is for the picture of the server - replace "iconPFP" with the file name of the picture (example being image.png). Make sure the image is in the same directory as the bot!

Issues will be addressed but this project will not be maintained regularly.
