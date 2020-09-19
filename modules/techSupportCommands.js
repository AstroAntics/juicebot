const { client, PREFIX } = require('../index'); // Import the client from index.js
const Discord = require('discord.js');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const malenames = ['Alex', 'Bob', 'Liam', 'William', 'Jonathan', 'Logan', 'Ben', 'Mason', 'Jacob', 'Michael', 'Daniel', 'Samuel', 'Rajesh', 'David', 'Sebastian', 'Luke'];

client.on("message", async (message) => {

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(PREFIX)) return;

    if (message.content.toLowerCase().startsWith(`${PREFIX}techsupport`)) {
        if (message.member.voice.channel) {
          var connection = await message.member.voice.channel.join();
		  techsupport(message, connection);
        } else {
          message.channel.send("You need to be in a voice channel to start a tech support session.");
        }
        return;
    }
});

async function playtechsupportsong(connection) {
	
	const dispatcher = connection
        .play(ytdl('https://youtu.be/DJztXj2GPfk'))
        .on("finish", () => {
            playtechsupportsong(connection);
			return;
        })
        .on("error", (error) => console.error(error));
	
}

async function techsupport(message, connection) {
	playtechsupportsong(connection); // Not the best idea but let's try it out!
	message.channel.send('Thank you for calling support, my name is ' + malenames[Math.floor(Math.random(0, malenames.length))] + ', how can I help you?');
	message.channel.awaitMessages(m => m.author.id == message.author.id,
                            {max: 1, time: 30000}).then( collected => {
                                searchstack(message);    
                            }).catch(() => {
                                message.channel.send('Timed out.');
                            });
}

async function searchstack(message) {
	const stacksearch = await fetch(`https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=activity&q=${message.content.toLowerCase()}&site=stackoverflow`);
	const stackjson = await stacksearch.json();
	message.channel.send(`This might be a solution: \n${stackjson.items[0].owner.link}`);	
}