const Socket = require('net').Socket;

module.exports = function scaner(options) {
    return new Promise((resolve, reject) => {

        let port = options.port || 22;
        let host = options.host || "127.0.0.1";
        let timeout = options.timeout || 200;

        let socket = new Socket();

        socket.on("connect", () => {
            resolve("open");
            socket.destroy();
        });

        socket.setTimeout(timeout);
        socket.on('timeout', () => {
            resolve("close");
            socket.destroy();
        });

        socket.on('error', (exception) => {
            resolve("close");
            console.error(exception);
            socket.destroy();
        });

        socket.connect(port, host);
    });
};
