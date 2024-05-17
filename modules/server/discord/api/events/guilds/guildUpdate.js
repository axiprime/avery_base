export const name = 'guildUpdate';
export const once = false;
/**
 * @param { import("discord.js").Guild } guild 
 * @param { import("../../discord").default } client 
 */
export async function execute(oldGuild, newGuild, client) {

    const dbGuild = await client.GM.get_Guild(newGuild.id);
    if (dbGuild)
        await client.GM.update_Guild(newGuild.id, { name: newGuild.name, ownerId: newGuild.ownerId, icon: newGuild.icon });
    else
        await client.GM.insert_Guild(newGuild.id, newGuild.name, newGuild.ownerId, newGuild.icon);
}