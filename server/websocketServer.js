// import {server} from 'websocket';
// import http from 'http';
//
// let socket = new server({
//     httpServer: http.createServer().listen(3001)
// });
//
// let connection = null;
//
// let websocketServer = {
//
//    start: () => {
//     if(connection){return;}
//     socket.on('request', function(request) {
//         connection = request.accept(null, request.origin);
//         connection.on('close', function(connection) {
//             console.log('Websocket connection by client.');
//         });
//     });
//     console.log('Websocket server hosted');
//   },
//
//   getConnection: () => {
//     if(connection){return connection;}
//     this.start();
//     return connection;
//   }
// }
//
// module.exports = websocketServer;
