const Discord = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv');
const musicList = require('./musicList.json');
const client = new Discord.Client();

dotenv.config();
const prefix = process.env.PREFIX;
const token = process.env.TOKEN;

const msgList = {};

client.on('ready', () => {
    console.log('Ready!');
    client.user.setActivity('Vibing');
});

client.on('message', async message => {
    if(message.author.bot) return;
    if(message.content.indexOf(prefix) !== 0) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if(command === 'add') {
        const link = args.shift();
        if(musicList[link]){
            console.log(`Link already saved, use ${musicList[link]} to call it`);
            return;
        };

        msgList[message.id] = link;
    }

    if(command === 'save') {
        const jsonData = JSON.stringify(musicList);
        fs.writeFile("musicList.json", jsonData, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
});

client.on('messageReactionAdd', async (reaction,user) => {
    const messageId = reaction.message.id;
    const emoji = reaction._emoji.name;

    if(user.bot || !msgList[messageId]) return;
    if(Object.values(musicList).includes(emoji)){
        console.log('emoji already in use!');
        return;
    };

    musicList[msgList[messageId]] = emoji;
    reaction.message.delete();
    console.log(musicList);
});

client.login(token);