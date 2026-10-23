#include <DHT.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <time.h>

// Sensores
#define DHTPIN 4
#define DHTTYPE DHT22
#define LDRPIN 35

// Wi-Fi
const char* ssid = "Wokwi-GUEST";
const char* password = "";

// Servidor
const char* mqtt_server = "54.91.80.136";
const int mqtt_port = 1883;
const char* mqtt_user = "";
const char* mqtt_password = "";

// Tópicos
const char* topico_leituras = "/1ESPI/off-grid/attrs";
const char* topico_comandos = "/1ESPI/off-grid/cmd";

DHT dht(DHTPIN, DHTTYPE);
WiFiClient espClient;
PubSubClient client(espClient);

unsigned long ultimaLeitura = 0;
const long intervalo = 10000;

void callback(char* topic, byte* payload, unsigned int length)
{
  char msg[length + 1];
  memcpy(msg, payload, length);
  msg[length] = '\0';

  Serial.printf("Mensagem recebida no tópico %s: %s\n", topic, msg);

  // if (strcmp(msg, "comando") == 0) {
  //     Ação
  // }

}

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  pinMode(LDRPIN, INPUT);

  dht.begin();

  WiFi.begin(ssid, password);
  Serial.print("Conectando WiFi");

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Conectado!");

  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void reconnect() {
  while (!client.connected())
  {
     Serial.print("Conectando ao MQTT...");
        
        char clientId[30];
        snprintf(clientId, sizeof(clientId), "ESP32_Wokwi_%04X", random(0xffff));
        
        Serial.print("Servidor MQTT: ");
        Serial.println(mqtt_server);

        Serial.print("Porta MQTT: ");
        Serial.println(mqtt_port);

        Serial.print("Estado do Wi-Fi: ");
        Serial.println(WiFi.status());

        WiFiClient teste;
        Serial.print("Teste TCP: ");

        if (teste.connect(mqtt_server, mqtt_port)) {
            Serial.println("Conexao TCP estabelecida!");
            teste.stop();
        } else {
            Serial.println("Falha na conexao TCP!");
        }

        if (client.connect(clientId)) 
        { 
            Serial.println("Conectado!");
            // Assinatura de tópico efetuada com a nova constante
            client.subscribe(topico_comandos);
        } 
        else 
        {
            Serial.print("Falha, rc=");
            Serial.print(client.state());
            Serial.println(" Retentando em 5s...");
            delay(5000);
        }
  }
}

void loop() {
  if (!client.connected()) reconnect();

  client.loop();

  unsigned long now = millis();
  if (now - ultimaLeitura > intervalo)
  {
    ultimaLeitura = now;

    float t = dht.readTemperature();
    float h = dht.readHumidity();
    float l = analogRead(LDRPIN);
    l = 100 - ((l - 32) / (4063 - 32) * 100);

    if (isnan(t) || isnan(h))
    {
      Serial.println("Falha na leitura do DHT");
      return;
    }
    if (isnan(l)){
      Serial.println("Falha na leitura do LDR");
      return;
    }

    Serial.print("Temperatura: ");
    Serial.print(t);
    Serial.println(" °C");
    Serial.print("Umidade: ");
    Serial.print(h);
    Serial.println("%");
    Serial.print("Luminosidade: ");
    Serial.print(l);
    Serial.println("%");
  }
}
