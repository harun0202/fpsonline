// Gerekli Kütüphaneler: npm install socket.io
const io = require("socket.io")(7777, {
    cors: { origin: "*" }
});

let players = {};

io.on("connection", (socket) => {
    console.log("Yeni oyuncu bağlandı:", socket.id);
    players[socket.id] = { x: 0, y: 0, z: 0, ry: 0 };

    // Pozisyon Senkronizasyonu
    socket.on("playerMove", (data) => {
        players[socket.id] = data;
        io.emit("stateUpdate", players);
    });

    // Ateş Etme ve Çatışma
    socket.on("shoot", (data) => {
        // Burada basit bir şekilde ateş edildiği herkese bildirilebilir 
        // Veya Raycaster hit hesabı sunucuda yapılarak damage gönderilebilir.
        // Örnek: Rastgele hedefe 10 hasar vur (Gerçek senaryoda Ray-AABB intersection yapılır)
        socket.broadcast.emit('playerHit', 10); 
    });

    socket.on("disconnect", () => {
        console.log("Oyuncu ayrıldı:", socket.id);
        delete players[socket.id];
        io.emit("playerDisconnect", socket.id);
    });
});

console.log("Sunucu 7777 portunda çalışıyor...");