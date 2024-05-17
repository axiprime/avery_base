// Import necessary modules and configurations
import Server from './modules/server/express.js';
const ServerExpress = Server();
ServerExpress.start();
// Function to handle closing operations
const closeProcess = async (signal) => {
    await ServerExpress.close();
    console.info(`[PROCESS] Closing process with signal ${signal}`);
    process.exit(0);
}
// Common error handler
const handleError = (error, description = '') => {
    console.error(`[ERROR] ${description}:`, error);
    switch (description) {
        case 'Uncaught Exception':
            closeProcess('error');
            break;
        case 'Unhandled Rejection':
            break;
        default:
            break;
    }
}
// Common exit handler
const handleExit = async (signal) => {
    console.info(`### [${signal}] Closing server... ##########################`);
    await closeProcess(signal);
    console.info(`### [PROCESS] Process closed successfully ##################`);
}
// Handle process signals
['SIGINT', 'SIGQUIT', 'SIGTERM'].forEach(signal => process.on(signal, () => handleExit(signal)));
process.on("uncaughtException", (err) => handleError(err, 'Uncaught Exception'));
process.on("unhandledRejection", (reason, promise) => handleError(reason, 'Unhandled Rejection'));
process.on("exit", (code) => console.info(`[PROCESS] Process exited with code ${code}`));
