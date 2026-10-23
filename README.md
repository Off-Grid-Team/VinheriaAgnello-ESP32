# Monitoramento IoT de Adega — Vinheria Agnello

## 1. Sobre o projeto

Este projeto tem como objetivo desenvolver um sistema de monitoramento para uma adega, utilizando um ESP32 simulado no **Wokwi**, sensores de temperatura, umidade e luminosidade e comunicação via **MQTT**.

As informações coletadas são enviadas a um broker MQTT e podem ser visualizadas por meio do aplicativo **MyMQTT**. Além disso, o sistema permite enviar comandos remotamente para consultar seu estado e alterar o intervalo entre as leituras dos sensores.

### Funcionalidades

- Leitura de temperatura e umidade utilizando o sensor DHT22.
- Leitura de luminosidade utilizando um sensor LDR.
- Envio periódico das informações por MQTT.
- Visualização das mensagens recebidas no MyMQTT.
- Alteração remota do intervalo de leitura.
- Consulta do estado do dispositivo por meio de um comando MQTT.

## 2. Tecnologias e ferramentas utilizadas

| Tecnologia | Finalidade |
|---|---|
| ESP32 | Controlador do sistema |
| Wokwi | Simulação do circuito e execução do código |
| DHT22 | Medição de temperatura e umidade |
| LDR | Medição da luminosidade |
| MQTT | Comunicação entre o dispositivo e o aplicativo |
| PubSubClient | Biblioteca Arduino para comunicação MQTT |
| DHT sensor library | Biblioteca para leitura do DHT22 |
| MyMQTT | Publicação e recebimento de mensagens MQTT |

## 3. Estrutura dos arquivos

Disponibilize os arquivos do projeto em um repositório com uma estrutura semelhante à seguinte:

```text
monitoramento-adega/
├── README.md
├── diagram.json
├── libraries.txt
└── sketch.ino
```

- **`README.md`**: documentação e instruções para replicar o projeto.
- **`diagram.json`**: configuração do circuito simulado no Wokwi, incluindo o ESP32 e os sensores.
- **`libraries.txt`**: bibliotecas necessárias para executar o código.
- **`sketch.ino`**: código-fonte do ESP32.

Os nomes acima são uma sugestão de organização. Caso o Wokwi utilize nomes diferentes para os arquivos, mantenha os nomes existentes e atualize esta documentação.

Também é recomendável disponibilizar o link do projeto no Wokwi e capturas de tela do circuito em funcionamento e das mensagens recebidas no MyMQTT.

## 4. Pré-requisitos

Antes de iniciar, é necessário ter:

- Acesso à internet.
- Uma conta no [Wokwi](https://wokwi.com/).
- O aplicativo [MyMQTT](https://mymqtt.app/) ou uma ferramenta equivalente para publicar e receber mensagens MQTT.
- As bibliotecas `PubSubClient` e `DHT sensor library` disponíveis no ambiente de compilação.

O projeto foi configurado para utilizar a rede simulada `Wokwi-GUEST`, disponibilizada pelo Wokwi.

## 5. Montagem do circuito

Crie um projeto ESP32 no Wokwi e adicione os seguintes componentes:

- 1 ESP32.
- 1 sensor DHT22.
- 1 sensor LDR com o circuito de leitura analógica adequado.

### Ligações dos componentes

| Componente | Pino do componente | Pino do ESP32 |
|---|---|---|
| DHT22 | DATA | GPIO 4 |
| LDR | Saída analógica | GPIO 35 |

O DHT22 também deve receber alimentação e GND conforme a configuração do componente no Wokwi. O LDR deve ser conectado de forma que sua saída produza uma tensão analógica compatível com o GPIO 35, utilizando o circuito de divisor de tensão apropriado.

**Importante:** as ligações devem corresponder aos pinos definidos no código-fonte. Caso o circuito seja alterado, atualize também as definições dos pinos no programa.

## 6. Configuração do código

No arquivo `sketch.ino`, configure os parâmetros de conexão Wi-Fi e MQTT.

### Wi-Fi

Para a simulação no Wokwi, utilize:

```cpp
const char* ssid = "Wokwi-GUEST";
const char* password = "";
```

Essa configuração é específica para o ambiente simulado. Em um ESP32 físico, substitua os valores pelo nome e pela senha da rede Wi-Fi utilizada.

### Broker MQTT

A configuração utilizada no projeto é:

```cpp
const char* mqtt_server = "3.135.234.101";
const int mqtt_port = 1883;

const char* topico_leituras = "/1ESPI/off-grid/attrs";
const char* topico_comandos = "/1ESPI/off-grid/cmd";
```

O broker deve estar acessível tanto pelo ESP32 simulado quanto pelo MyMQTT. Se o endereço do broker mudar ou deixar de estar disponível, atualize a configuração nos dois lados.

A porta `1883` é normalmente utilizada para MQTT sem criptografia. Não utilize esse tipo de conexão para transmitir dados sensíveis em um ambiente de produção.

## 7. Instalação e execução

### Etapa 1 — Abrir o projeto no Wokwi

1. Acesse [Wokwi](https://wokwi.com/).
2. Crie ou abra o projeto ESP32.
3. Adicione os sensores e reproduza as ligações descritas anteriormente.
4. Copie o conteúdo de `sketch.ino` para o arquivo de código do projeto.
5. Instale ou habilite as bibliotecas necessárias.
6. Inicie a simulação.

Se o projeto já estiver disponível por meio de um link público do Wokwi, basta abrir o link e iniciar a simulação.

### Etapa 2 — Conectar ao broker MQTT

Com a simulação em execução, o ESP32 deverá:

1. Conectar-se à rede Wi-Fi.
2. Estabelecer uma conexão com o broker MQTT.
3. Inscrever-se no tópico de comandos `/1ESPI/off-grid/cmd`.
4. Realizar as leituras dos sensores e publicar os resultados periodicamente.

O intervalo inicial de leitura é de **10 segundos**.

Consulte o monitor serial do Wokwi para verificar mensagens de conexão e envio das leituras.

### Etapa 3 — Configurar o MyMQTT

No MyMQTT, configure a conexão com os seguintes parâmetros:

| Parâmetro | Valor |
|---|---|
| Host | `3.135.234.101` |
| Porta | `1883` |
| Protocolo | MQTT |
| Usuário e senha | Conforme a configuração do broker; não necessários na configuração testada |
| Tópico de leituras | `/1ESPI/off-grid/attrs` |
| Tópico de comandos | `/1ESPI/off-grid/cmd` |

Conecte-se ao broker e inscreva-se no tópico `/1ESPI/off-grid/attrs` para receber as mensagens publicadas pelo ESP32.

Para enviar comandos, utilize a função de publicação do aplicativo e publique no tópico `/1ESPI/off-grid/cmd`.

**Observação:** o endereço do broker utilizado foi testado durante o desenvolvimento, mas sua disponibilidade futura não é garantida. Se a conexão falhar, verifique se o broker continua ativo e acessível.

## 8. Formato das mensagens

### Leituras dos sensores

As leituras são publicadas no tópico:

```text
/1ESPI/off-grid/attrs
```

O formato da mensagem é semelhante a:

```text
T:24.5 | H:60.2 | L:78.3
```

Em que:

- `T`: temperatura em graus Celsius.
- `H`: umidade relativa do ar em porcentagem.
- `L`: valor de luminosidade convertido para uma escala percentual pelo código.

O valor de luminosidade é uma estimativa derivada da leitura analógica do LDR e da calibração utilizada no programa. Ele não representa necessariamente uma medição física calibrada em lux.

### Comandos remotos

Os comandos são publicados no tópico:

```text
/1ESPI/off-grid/cmd
```

| Comando | Descrição |
|---|---|
| `status` | Solicita o estado do dispositivo e o intervalo atual de leitura |
| `interval:5000` | Define o intervalo de leitura para 5 segundos |
| `interval:10000` | Define o intervalo de leitura para 10 segundos |
| `interval:30000` | Define o intervalo de leitura para 30 segundos |

Exemplo de comando:

```text
interval:5000
```

Após receber um comando válido, o ESP32 atualiza o intervalo e publica uma mensagem de confirmação no tópico de leituras.

Se um intervalo diferente dos valores permitidos for enviado, o sistema informa que o intervalo é inválido.

**Importante:** as confirmações dos comandos e as leituras dos sensores são publicadas no mesmo tópico. Por isso, o MyMQTT poderá exibir os dois tipos de mensagem juntos.

## 9. Como testar o funcionamento

Execute os testes a seguir para verificar se o projeto foi replicado corretamente.

### Teste 1 — Recebimento das leituras

1. Inicie a simulação no Wokwi.
2. Conecte o MyMQTT ao broker.
3. Inscreva-se no tópico `/1ESPI/off-grid/attrs`.
4. Verifique se as mensagens contendo temperatura, umidade e luminosidade aparecem periodicamente.

**Resultado esperado:** recebimento de novas leituras aproximadamente a cada 10 segundos, enquanto esse for o intervalo configurado.

### Teste 2 — Alteração do intervalo

1. No MyMQTT, publique `interval:5000` no tópico `/1ESPI/off-grid/cmd`.
2. Verifique a mensagem de confirmação.
3. Observe o intervalo entre as leituras seguintes.

**Resultado esperado:** as leituras passam a ocorrer aproximadamente a cada 5 segundos.

Repita o teste com `interval:10000` e `interval:30000` para verificar os outros intervalos permitidos.

### Teste 3 — Consulta do estado

1. Publique `status` no tópico `/1ESPI/off-grid/cmd`.
2. Verifique a resposta recebida no tópico `/1ESPI/off-grid/attrs`.

**Resultado esperado:** o dispositivo publica uma mensagem indicando que está online e informa o intervalo de leitura configurado.

### Teste 4 — Validação de comandos inválidos

1. Publique `interval:7000` no tópico de comandos.
2. Observe a resposta do dispositivo.

**Resultado esperado:** o sistema informa que o intervalo é inválido e mantém o intervalo anterior.

## 10. Solução de problemas

| Problema | Possível solução |
|---|---|
| O ESP32 não conecta ao Wi-Fi | Verifique se está utilizando `Wokwi-GUEST` na simulação |
| O ESP32 não conecta ao broker | Confira o endereço IP, a porta, a disponibilidade do broker e a conectividade de rede |
| Nenhuma leitura aparece no MyMQTT | Verifique a conexão com o broker e a inscrição no tópico `/1ESPI/off-grid/attrs` |
| Os comandos não funcionam | Confirme se o ESP32 está inscrito em `/1ESPI/off-grid/cmd` e se o comando foi publicado nesse tópico |
| A leitura do DHT22 falha | Verifique as ligações, o pino DATA e a configuração do sensor no código |
| A luminosidade parece incorreta | Verifique o divisor de tensão, o pino analógico e a calibração utilizada na conversão |
| A conexão MQTT cai repetidamente | Verifique se o broker está ativo e se a conexão Wi-Fi permanece disponível |

## 11. Limitações

- O sistema depende da disponibilidade do broker MQTT utilizado.
- A luminosidade é representada por uma escala percentual estimada, não por uma medição calibrada em lux.
- O intervalo de leitura pode ser alterado apenas para os valores permitidos pelo código.
- O projeto foi desenvolvido e testado em ambiente simulado no Wokwi; o funcionamento em hardware físico pode exigir ajustes nas ligações, na rede e na configuração do broker.

## 12. Links

| Link Wokwi |
| :---------------------------------------: |
| [Clique aqui para acessar!]([https://www.tinkercad.com/things/lkgLl19LRHl-temperaturaumidade-vinheria-agnello?sharecode=YlTjqZkmewffe9tO3R5gVDQQ_gfvheSdDE0nYS-RPK4](https://wokwi.com/projects/478515319809742849)) |


## 12. Autores

Projeto acadêmico desenvolvido para a atividade de IoT relacionada ao monitoramento de uma adega da Vinheria Agnello.

| Nomes         | RM             |
| :-------------| :------------: |
| Felipe Rabelo |  570340
| Gustavo Ferreira Tavares | 569928 |
| Ricardo Salmerón | 572916 |
