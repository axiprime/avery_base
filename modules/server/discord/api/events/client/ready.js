export const name = 'ready';
export const once = true;
/** 
* @param { import("../../discord").default } client 
* @returns 
*/
export async function execute(client) {
    await client.GM.syncGuild();
}
export const button = [];
export const select = [];
export const modal = [];