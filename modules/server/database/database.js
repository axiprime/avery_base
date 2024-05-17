import mysql2 from 'mysql2/promise';
// Connect to Mysql Database
const connect = async (config) => {
    const connection = await mysql2.createConnection({
        host: config.MYSQL_HOST,
        user: config.MYSQL_USER,
        password: config.MYSQL_PASSWORD,
        database: config.MYSQL_DATABASE,
        port: config.MYSQL_PORT,
    });
    connection.connect((err) => {
        if (err) {
        console.error("[MYSQL] Error connecting to database: " + err.stack);
        return;
        }
        console.info("[MYSQL] Connected to database as id " + connection.threadId);
    });
    return connection;
}
const disconnect = async (connection) => {
    connection.end((err) => {
        if (err) {
            console.error("[MYSQL] Error disconnecting from database: " + err.stack);
            return;
        }
        console.info("[MYSQL] Disconnected from database");
    });
}
export default {
    connect,
    disconnect
};