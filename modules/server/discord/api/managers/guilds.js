export default class GuildsManager {
    #client;
    constructor(client) {
        this.#client = client;
    }
    async syncGuild() {     
        const dbGuilds = await this.get_Guilds();
        for await (const dbGuild of dbGuilds) {
            const guild = await this.get(dbGuild.guildId);
            if (!guild) {
                await this.update_Guild(dbGuild.guildId, { leaved_at: new Date() });
                continue;
            }
            const updateValue = {}
            if (guild.name != dbGuild.name)
                updateValue.name = guild.name;
            if (guild.ownerId != dbGuild.ownerId)
                updateValue.ownerId = guild.ownerId;
            if (guild.icon != dbGuild.icon)
                updateValue.icon = guild.icon;
            if (guild.leaved_at)
                updateValue.leaved_at = null;
            if (Object.keys(updateValue).length > 0)
                await this.update_Guild(dbGuild.guildId, updateValue)
        }
        // Add guilds that are not in the database
        for await (const [guildId, guild] of this.#client.guilds.cache) {
            const dbGuild = await this.get_Guild(guild.id);
            if (!dbGuild) {
                await this.insert_Guild(guildId, guild.ownerId, guild.name, guild.icon);
            }
        }
    }
    /**
    * Fetch a guild from the client
    * @param {BIGINT} guildId 
    * @returns {Promise<Discord.GuildManager> | Promise | Object}
    * @example await client.GM.get('123456789123456789');
    */
    async get(guildId) {
        if (this.#client.guilds.cache.has(guildId)) {
            return this.#client.guilds.cache.get(guildId);
        } else {
            try {
                let c = await this.#client.guilds.fetch(guildId);
                if (c) return c
            } catch (error) {
                return false
            }
        }
        return null;
    }

    async get_Guilds() {
        try {
            const [rows, fields] = await this.#client.db.query('SELECT * FROM guilds');
            return rows;
        } catch (error) {
            console.error('Error fetching guilds:', error);
            throw error;
        }
    }

    async get_Guild(guildId) {
        try {
            const [rows, fields] = await this.#client.db.query('SELECT * FROM guilds WHERE guildId = ?', [guildId]);
            // Return the first row only
            return rows.length === 0 ? null : rows[0];
        } catch (error) {
            console.error('Error fetching guild:', error);
            throw error;
        }
    }

    async update_Guild(guildId, data) {
        try {
            // Construct the query parts
            const columns = Object.keys(data).map(key => `${key} = ?`).join(', ');
            const values = [...Object.values(data), guildId];
            const query = `UPDATE guilds SET ${columns} WHERE guildId = ?`;
            // Execute the query with a prepared statement
            await this.#client.db.query(query, values);
        } catch (error) {
            console.error('Error updating guild:', {
                guildId,
                data,
                error: error.message,
            });
            throw error; // Propagate the error to be handled by the caller
        }
    }
    

    async insert_Guild(guildId, ownerId, name, icon) {
        try {
            await this.#client.db.query('INSERT INTO guilds (guildId, ownerId, name, icon) VALUES (?, ?, ?, ?)', [guildId, ownerId, name, icon]);
        } catch (error) {
            console.error('Error inserting guild:', error);
            throw error;
        }
    }

}