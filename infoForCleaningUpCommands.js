// {
//     const guildId = GUILD_ID_QG; // change per server
//     let guild = client.guilds.cache.get(guildId);
//     guild.commands.fetch(interaction.commandId) // id of your command
//       .then( (command) => {
//     log(`Fetched command ${command.name}`)
//     // further delete it like so:
//     command.delete()
//     log(`Deleted command ${command.name}`)
//     }).catch(error);

//     client.application?.commands.fetch(interaction.commandId) // id of your command
//       .then( (command) => {
//     log(`Fetched command ${command.name}`)
//     // further delete it like so:
//     command.delete()
//     log(`Deleted command ${command.name}`)
//     }).catch(error);

// }