"use strict";
// import WebSocket , { WebSocketServer } from "ws";
Object.defineProperty(exports, "__esModule", { value: true });
// const ws = new WebSocketServer({port: 8080});
// interface usertype {
//     socket : WebSocket,
//     room : string
// }
// let user : usertype[] = [];
// ws.on("connection" , (socket) => {
//     socket.on("message" , (message) =>{
//         const parsedmessage = JSON.parse(message as unknown as string);
//         if(parsedmessage.type === "join"){
//             user.push({
//                 socket,
//                 room : parsedmessage.payload.roomid
//             })
//         }
//         if(parsedmessage.type === "chat"){
//             const currentuser = user.find(x => x.socket == socket)?.room;
//             user.forEach((x) => {
//                 if (x.room === currentuser) {
//                 x.socket.send(parsedmessage.payload.message);
//             }
//     });
//         }
//     })
// })
// server.ts
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const users = [];
console.log('✅ Server running on ws://localhost:8080');
wss.on('connection', (socket) => {
    socket.on('message', (data) => {
        const msg = JSON.parse(data.toString());
        // 🔵 Handle join
        if (msg.type === 'join') {
            const { roomId, username } = msg.payload;
            users.push({ socket, room: roomId, name: username });
            console.log(`👤 ${username} joined ${roomId}`);
            // Notify others
            users.forEach((user) => {
                if (user.room === roomId && user.socket !== socket) {
                    user.socket.send(JSON.stringify({
                        type: 'info',
                        payload: { message: `🔔 ${username} joined the room.` },
                    }));
                }
            });
        }
        // 🟡 Handle chat
        if (msg.type === 'chat') {
            const sender = users.find((u) => u.socket === socket);
            if (!sender)
                return;
            users.forEach((user) => {
                if (user.room === sender.room) {
                    user.socket.send(JSON.stringify({
                        type: 'chat',
                        payload: {
                            message: `${sender.name}: ${msg.payload.message}`,
                        },
                    }));
                }
            });
        }
    });
    socket.on('close', () => {
        const user = users.find((u) => u.socket === socket);
        if (user) {
            users.splice(users.indexOf(user), 1);
            console.log(`❌ ${user.name} left ${user.room}`);
        }
    });
});
