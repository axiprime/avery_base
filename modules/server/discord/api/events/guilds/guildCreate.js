export const name = 'guildCreate';
export const once = false;
/**
 * @param { import("discord.js").Guild } guild 
 * @param { import("../../discord").default } client 
 */
export async function execute(guild, client) {

    const dbGuild = await client.GM.get_Guild(guild.id);
    if (dbGuild)
        await client.GM.update_Guild(guild.id, { joined_at: new Date(), leaved_at: null });
    else
        await client.GM.insert_Guild(guild.id, guild.name, guild.ownerId, guild.icon);

}