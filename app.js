const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const { Client } = require('discord.js-selfbot-v13');
const { HttpsProxyAgent } = require('https-proxy-agent');


const TOKENS_FILE = path.join(__dirname, 'tokens.txt');
const OUTPUT_FILE = path.join(__dirname, 'createdGuilds.txt');
const TEMPLATE_URL = '';
const ICON_BUFFER = fs.readFileSync(path.join(__dirname, 'iconPFP'));
const PROXY_URL = '';

// returns the current ip being used
async function logCurrentIP(agent, label) {
  try {
    const res = await fetch('https://api.ipify.org?format=json', {
      agent,
      timeout: 5000,
    });
    const { ip } = await res.json();
    console.log(`${label} IP: ${ip}`);
  } catch (e) {
    console.error(`${label} Failed to fetch IP: ${e.message}`);
  }
}

const tokens = fs.readFileSync(TOKENS_FILE, 'utf8')
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(Boolean);

fs.writeFileSync(OUTPUT_FILE, '', 'utf8');

tokens.forEach((token, index) => {
  const proxyAgent = new HttpsProxyAgent(PROXY_URL);
  const client = new Client({
    http: { agent: proxyAgent },
    ws:   { agent: proxyAgent },
  });

  client.once('ready', async () => {
    console.log(`[${client.user.tag}] connected.`);

    await logCurrentIP(proxyAgent, client.user.tag);

    try {
      const template = await client.fetchGuildTemplate(TEMPLATE_URL);
      const guild = await template.createGuild('gateway', ICON_BUFFER);
      console.log(`created "${guild.name}" (ID: ${guild.id})`);

      const lines = fs.readFileSync(OUTPUT_FILE, 'utf-8').split('\n');
      lines[index] = guild.id;
      fs.writeFileSync(OUTPUT_FILE, lines.join('\n'), 'utf8');

    } catch (err) {
      console.error(`failed to create guild for ${client.user.tag}: ${err.message}`);

      const lines = fs.readFileSync(OUTPUT_FILE, 'utf-8').split('\n');
      lines[index] = '';
      fs.writeFileSync(OUTPUT_FILE, lines.join('\n'), 'utf8');
    }

    client.destroy();
  });

  client.on('error', err => {
    console.error(`client error for ${token.slice(-6)}:`, err.message);
  });

  client.login(token).catch(err => {
    console.error(`login failed for token …${token.slice(-6)}:`, err.message);

    const lines = fs.readFileSync(OUTPUT_FILE, 'utf-8').split('\n');
    lines[index] = '';
    fs.writeFileSync(OUTPUT_FILE, lines.join('\n'), 'utf8');
  });
});
