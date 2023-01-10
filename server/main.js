const fs = require('node:fs');
const path = require('node:path');
const root = GetResourcePath(GetCurrentResourceName());

const { Client, Collection, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
sv_config = require(path.join(root, 'env.js'));

on("onResourceStart", (resourceName) => {
	if (GetCurrentResourceName() !== "ccDiscordWrapper" && GetResourceMetadata(GetCurrentResourceName(), 'supportChecker') === 'true') {
		return console.warn(`^6[Warning]^0 For better support, it is recommended that "${GetCurrentResourceName()}" be renamed to "ccDiscordWrapper"^0`);
	}
});

if (GetResourceMetadata('ccDiscordWrapper', 'DiscordStatusEnabled') === 'true'){
	discordProcess();
}

function discordProcess() {
	client.commands = new Collection();
	client.discord = require('discord.js');
	client.statusMessage = null;
	
	const commandsPath = path.join(root, 'server', 'commands');
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
	
	const eventsPath = path.join(root, 'server', 'events');
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
	
	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		const event = require(filePath);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		} else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
	
	client.login(sv_config.Discord_Token);

	async function sendNewMessage(channelId, message){
		const channel = await client.channels.cache.get(channelId);
		await channel.bulkDelete(1).catch(e => console.warn('Failed to delete previous message - probably becuase there isn\'t one!'));
		let newEmbed = new client.discord.EmbedBuilder()
		.setColor(0x0099FF)
		.setTitle(`${message[0]}`)
		.setDescription(`${message[1]}`)
		.setTimestamp()
		.setFooter({ text: 'This message was generated by ccDiscordWrapper', iconURL: 'https://conceptcollective.net/img/icon.png', URL: 'https://conceptcollective.net' });
		
		await channel.send({embeds: [newEmbed]});
	}	

	exports('sendNewMessage', sendNewMessage);	
	
}