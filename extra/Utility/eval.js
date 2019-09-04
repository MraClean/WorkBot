const {inspect} = require("util")
const deps = require('../deps')
let owner = deps.settings.owner

module.exports = {
    name: "eval",
    alias: "evaluate",
    description: "Run a command (Only usable by bot owner)",
    type: "any",
    runCommand(args, msg, client, rest = {}) {
        if(!msg.author.id == owner){return msg.channel.send("No").then(msg => msg.delete(5000))}
            try {
                let code = args.join(" ")
                let evaluated = inspect(eval(code, {depth: 0}))
                if(code){
                    let hrStart = process.hrtime()
                    let hrDiff
                    hrDiff = process.hrtime(hrStart)
                    if(String(`Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1]/100000}ms \`\`\`javascript\n${evaluated}\n\`\`\``).length > 1900){
                        return msg.channel.send(`Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1]/100000}ms \n Output longer then 2000 characters`)
                    }else{
                        return msg.channel.send(`Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s` : ''}${hrDiff[1]/100000}ms \`\`\`javascript\n${evaluated}\n\`\`\``,{maxLength:1900})
                    }
                }else{
                    msg.channel.send("`Executed Nothing`")
                }
            } catch (error) {
                msg.channel.send(`Error while executing: \`${error.message}\` `)
            }
    }
}