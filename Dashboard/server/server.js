const mqtt = require("mqtt");
const { WebSocketServer, WebSocket } = require("ws");

// Configuração do broker MQTT utilizado pelo ESP32
const BROKER_MQTT = "mqtt://3.135.234.101:1883";
const TOPICO_LEITURAS = "/1ESPI/off-grid/attrs";

// Servidor WebSocket para comunicação com o React
const PORTA_WEBSOCKET = 8080;

const servidorWebSocket = new WebSocketServer({
    port: PORTA_WEBSOCKET,
});

console.log(`Servidor WebSocket iniciado na porta ${PORTA_WEBSOCKET}`);

// Conecta ao broker usando MQTT TCP
const clienteMQTT = mqtt.connect(BROKER_MQTT, {
    clientId: `servidor_adega_${Math.random().toString(16).slice(2, 10)}`,
    reconnectPeriod: 3000,
    connectTimeout: 10000,
});

clienteMQTT.on("connect", () => {
    console.log("Conectado ao broker MQTT!");

    clienteMQTT.subscribe(TOPICO_LEITURAS, (erro) => {
        if (erro) {
            console.error("Erro ao assinar o tópico:", erro);
            return;
        }

        console.log(`Inscrito no tópico ${TOPICO_LEITURAS}`);
    });
});

clienteMQTT.on("reconnect", () => {
    console.log("Tentando reconectar ao broker MQTT...");
});

clienteMQTT.on("error", (erro) => {
    console.error("Erro MQTT:", erro.message);
});

clienteMQTT.on("message", (topico, mensagem) => {
    const texto = mensagem.toString();

    console.log(`[MQTT] ${topico}: ${texto}`);

    // Encaminha a mensagem para todos os navegadores conectados
    servidorWebSocket.clients.forEach((cliente) => {
        if (cliente.readyState === WebSocket.OPEN) {
            cliente.send(
                JSON.stringify({
                    topico,
                    mensagem: texto,
                })
            );
        }
    });
});

servidorWebSocket.on("connection", (cliente) => {
    console.log("React conectado ao servidor WebSocket!");

    cliente.on("error", (erro) => {
        console.error("Erro WebSocket:", erro.message);
    });
});

servidorWebSocket.on("error", (erro) => {
    console.error("Erro no servidor WebSocket:", erro.message);
});

process.on("SIGINT", () => {
    console.log("\nEncerrando servidores...");

    servidorWebSocket.close();
    clienteMQTT.end(false, () => {
        process.exit(0);
    });
});