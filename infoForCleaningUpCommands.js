// {
//     const guildId = GUILD_ID_QG; // change per server
//     let guild = client.guilds.cache.get(guildId);
//     guild.commands.fetch(interaction.commandId) // id of your command
//       .then( (command) => {
//     console.log(`Fetched command ${command.name}`)
//     // further delete it like so:
//     command.delete()
//     console.log(`Deleted command ${command.name}`)
//     }).catch(console.error);

//     client.application?.commands.fetch(interaction.commandId) // id of your command
//       .then( (command) => {
//     console.log(`Fetched command ${command.name}`)
//     // further delete it like so:
//     command.delete()
//     console.log(`Deleted command ${command.name}`)
//     }).catch(console.error);

// }