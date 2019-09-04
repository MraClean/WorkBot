# Information

> Basically folders go in here. All they need is the same command handler function to run.
>
> The rest is a list of commands just so you know


### Heres the command example for you 
```javascript
module.exports = {
    name: "COMMAND_NAME",
    alias: "COMMAND_ALIAS",
    description: "COMMAND_DESCRIPTION",
    type: "COMMAND_TYPE",
    runCommand(args,msg,client,rest = {}){
        // COMMAND FUNCTION
    }
}
```

> Valid types for ```type``` is
>
> any
>
> guild
>
> dm
>
> Any allows the command to work in both dms and guilds
>
> Guild allows the command to only work in guilds
>
> Dm allows the command to only work in dms
>
> The type must be lowercase

### Special Files

> If you want a file to not be added name it `ignore.js`
>
> If you want a file to be the settings name it `settings.js`
>
> Example of the settings file
```js
module.exports = {
    ['category']:'Misc',
    ['showInAll']:true,
    ['deps']:require('../deps')
}
```