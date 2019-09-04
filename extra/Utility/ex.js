let {exec} = require('child_process');
const deps = require('../deps')
let owner = deps.settings.owner

async function sh(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

module.exports = {
    name: "ex",
    alias: "execute",
    description: "Run a command in the shell (Only usable by bot owner)",
    type: "any",
    runCommand(args, msg, client, rest = {}) {
        if(!msg.author.id == owner){return msg.channel.send("No").then(msg => msg.delete(5000))}
            try {
                let code = args.join(" ")
                if(code){
                    sh(code).catch(err => {
                        msg.channel.send(`Error while executing: \`${err.message}\` `)
                    }).then(result => {
                        if(result.stdout.length > 1800){
                            msg.channel.send('Input: `'+code+'`\nOutput: \n\nOutput too long to show...')
                        }else{
                            msg.channel.send('Input: `'+code+'`\nOutput: \n\n'+'```'+result.stdout+'```')
                        }
                    })
                }else{
                    msg.channel.send("`Executed Nothing`")
                }
            } catch (error) {
                msg.channel.send(`Error while executing: \`${error.message}\` `)
            }
    }
}