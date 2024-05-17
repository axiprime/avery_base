export const name = 'guildDelete';
export const once = false;
/**
 * @param { import("discord.js").Guild } guild 
 * @param { import("../../discord").default } client 
 */
export async function execute(guild, client) {
    const dbGuild = await client.GM.get_Guild(guild.id);
    if(dbGuild)
        await client.GM.update_Guild(guild.id, { leaved_at: new Date() });
}