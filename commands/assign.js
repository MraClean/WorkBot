const models = require("../models/models")
const unirest = require("unirest")
module.exports = {
    name: "assign",
    alias: "assigntask",
    description: "This command assigns a user to a task",
    type: "",
    runCommand(args,msg,client,rest = {}){
        models.User.findOne({
            id:msg.author.id
        }, (err,user) => {
            if (err){console.error(err)}
            if(!user) {
                return msg.channel.send("No teams found!")
            }else{
               let teams = user.teams
               if(teams.length == 0){return msg.channel.send("No teams found!")}
               let names = []
               for (let i = 0; i < teams.length; i++) {
                   const team = teams[i];
                   names.push(`${i+1}. ${team.name}`)
               }
               names = names.map(x => x)
               let request = {
                "creator":msg.author.id,
                "worker":"",
                "name":"",
                "desc":"",
                "due":"",
                "token":""
            }
            let filter = m => m.author.id == msg.author.id
            msg.channel.send(`Please Fill This Information Out. \n Say exit at anytime to cancel the team making process. \nFirst Question: What team to send task to? \n\n${names.map(x => x)}`).then(original =>{
                original.channel.awaitMessages(filter,{
                    max:1,
                    time:10000
                }).then(collected => {
                    let message = collected.first()
                    let msg = message.content
                    if(message.content == "exit"){return msg.channel.send("Exited Team Making Process!")}
                    if (isNaN(Number(msg))) {
                        return original.channel.send("Thats not a valid number!");
                    }
                    if (Number(msg) > teams.length) {
                        return original.channel.send("Thats not a valid number!");
                    }
                    let selected = teams[Number(msg) - 1];
                    original.edit(
                        `Type the id of the user`
                    );
                    models.Team.findOne({
                        id:selected.id
                    }, (err,team) => {
                        if (err){console.error(err)}
                        if(!team) {
                            return original.channel.send("An Error Happened While Finding Team, Try Again Later")
                        }else{
                            selected = team
                            request.token = selected.token;
                            original.channel
                              .awaitMessages(filter, {
                                max: 1,
                                time: 20000
                              })
                              .then(collected => {
                                let message = collected.first();
                                if (message.content == "exit") {
                                  return original.channel.send("Exited Team Making Process!");
                                }
                                let msg = collected.first().content;
                                if (isNaN(Number(msg))) {
                                  return original.channel.send("Thats not a id!");
                                }
                                let user = client.users.find(x => x.id == msg);
                                if (!user) {
                                  return original.channel.send("Not user found!");
                                }
                                let member = selected.members.find(x => x == user.id);
                                if (!member) {
                                  return original.channel.send("That user isn't in your team...");
                                }
                                request.worker = msg
                                original.edit(`Type the name of the task`);
                                original.channel
                                  .awaitMessages(filter, {
                                    max: 1,
                                    time: 10000
                                  })
                                  .then(collected => {
                                    let message = collected.first();
                                    if (message.content == "exit") {
                                      return original.channel.send("Exited Team Making Process!");
                                    }
                                    let msg = collected.first().content;
                                    request.name = msg;
                                    original.edit(`Type the description of the task`);
                                    original.channel
                                      .awaitMessages(filter, {
                                        max: 1,
                                        time: 120000
                                      })
                                      .then(collected => {
                                        let message = collected.first();
                                        if (message.content == "exit") {
                                          return original.channel.send("Exited Team Making Process!");
                                        }
                                        let msg = collected.first().content;
                                        request.desc = msg;
                                        original.edit(`Type the due date of the task`);
                                        original.channel
                                          .awaitMessages(filter, {
                                            max: 1,
                                            time: 30000
                                          })
                                          .then(collected => {
                                            let message = collected.first();
                                            if (message.content == "exit") {
                                              return original.channel.send("Exited Team Making Process!");
                                            }
                                            let msg = collected.first().content;
                                            request.due = msg;
                                            original.edit("Finished!");
                                            unirest
                                              .post(`${process.env.endpoint}/team/newTask`)
                                              .headers({
                                                Accept: "application/json",
                                                "Content-Type": "application/json"
                                              })
                                              .send(request)
                                              .then(response => {
                                                console.log(JSON.stringify(request))
                                                original.channel.send(
                                                  "You have finished and send the task!"
                                                );
                                              });
                                          })
                                          .catch(err => original.channel.send("Times Up!"));
                                      })
                                      .catch(err => original.channel.send("Times Up!"));
                                  })
                                  .catch(err => original.channel.send("Times Up!"));
                              })
                              .catch(err => original.channel.send("Times Up!"));                            
                        }
                    })
                }).catch((err) => original.channel.send("Times Up!"))
            })
            }
        })
    }
}