const discord = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");
const settings = require('./settings');
const io = require('@pm2/io');

const client = new discord.Client;

const UserMetric = io.metric({
    name: 'Users',
});
const GuildMetric = io.metric({
    name: 'Guild',
});

const commandList = [];
const categoryList = [];

require("dotenv").config();

mongoose.connect(`mongodb://localhost/work-bot`, {useNewUrlParser: true}, () => {
    console.log('Connected To Database')
});

client.on('ready', () => {
    console.log('Bot Online For Api Keys')
});

client.on('message', (msg) => {
    if (!msg.content.startsWith(settings.Prefix)) {
        return
    }
    if (!msg.author) {
        return
    }
    if (msg.author.id === client.user.id) {
        return
    }
    if (msg.author.bot) {
        return
    }
    handleCommand(msg)
});

let commands = fs.readdirSync(__dirname + '/commands');
for (let i = 0; i < commands.length; i++) {
    const file = commands[i];
    let command = require("./commands/" + file);
    if (!command.name || command.name === "") {
        console.log("Command without name sent!")
    } else {
        let category = categoryList.find(x => x.name === 'Work-Bot');
        if (!category) {
            categoryList.push({name: `Work-Bot`, desc: `The work-bot built in commands`})
        }
        commandList.push({
            name: command.name,
            alias: command.alias,
            description: command.description,
            run: command.runCommand,
            type: command.type,
            category: 'Work-Bot',
            showInAll: true
        })
    }
}

console.log('Loading Extras \n');
let extra = fs.readdirSync(__dirname + '/extra');
for (let i = 0; i < extra.length; i++) {
    const folder = extra[i];
    if (folder === 'deps.js' || folder === 'README.md') { // Ignore these files from the extras
    } else {
        let extraCommands = fs.readdirSync(__dirname + '/extra/' + folder);
        for (let v = 0; v < extraCommands.length; v++) {
            const file = extraCommands[v];
            let extraSettings = extraCommands.find(x => x === 'settings.js');
            if (extraSettings) {
                let folderSettings = require(`./extra/${folder}/settings.js`);
                if (!(file === 'settings.js' || file === 'ignore.js')) {
                    let command = require(`./extra/${folder}/${file}`);
                    console.log('Loading Extras...\nOn Command: ' + command.name + '\n');
                    if (!command.name || command.name === "") {
                        console.log("Command without name sent!")
                    } else {
                        let category = categoryList.find(x => x.name === folderSettings.category);
                        if (!category) {
                            categoryList.push({name: folderSettings.category, desc: folderSettings.desc})
                        }
                        commandList.push({
                            name: command.name,
                            alias: command.alias,
                            description: command.description,
                            run: command.runCommand,
                            type: command.type,
                            category: folderSettings.category,
                            showInAll: folderSettings.showInAll
                        })
                    }
                }
            } else {
                let command = require("./commands/" + file);
                console.log('Loading Extras...\nOn Command: ' + command.name + '\n');
                if (!command.name || command.name === "") {
                    console.log("Command without name sent!")
                } else {
                    let category = categoryList.find(x => x.name === `None`);
                    if (!category) {
                        categoryList.push({name: 'None', desc: 'No category was stated'})
                    }
                    commandList.push({
                        name: command.name,
                        alias: command.alias,
                        description: command.description,
                        run: command.runCommand,
                        type: command.type,
                        category: 'None',
                        showInAll: true
                    })
                }
            }
        }
    }
}

function handleCommand(msg) {
    let command = msg.content.split(" ")[0].replace(settings.Prefix, "");
    let args = msg.content.split(" ").slice(1);

    command = String(command).toLowerCase();
    let commandObject = commandList.find(x => x.name.toLowerCase() === command || x.alias.toLowerCase() === command);
    if (commandObject) {
        if (commandObject.type === 'guild') {
            if (msg.channel.type === 'text') {
                commandObject.run(args, msg, client, {commands: commandList, categories: categoryList});
                return
            } else {
                return msg.channel.send('Incorrect channel used!')
            }
        }
        if (commandObject.type === 'dm') {
            if (msg.channel.type === 'dm') {
                commandObject.run(args, msg, client, {commands: commandList, categories: categoryList});
                return
            } else {
                return msg.channel.send('Incorrect channel used!')
            }
        }
        if (commandObject.type === '' || commandObject.type === 'any') {
            commandObject.run(args, msg, client, {commands: commandList, categories: categoryList});

        }
    }
}

client.login(process.env.token);