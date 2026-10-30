# Monitoramento IoT de Adega — Vinheria Agnello

## 1. Sobre o projeto

Este projeto tem como objetivo desenvolver um sistema de monitoramento para uma adega, utilizando um ESP32 simulado no **Wokwi**, sensores de temperatura, umidade e luminosidade e comunicação via **MQTT**.

As informações coletadas são enviadas a um broker MQTT e podem ser visualizadas por meio do aplicativo **MyMQTT**. Além disso, o sistema permite enviar comandos remotamente para consultar seu estado e alterar o intervalo entre as leituras dos sensores.

O projeto também conta com um dashboard desenvolvido com **React**, **Vite** e **Tailwind CSS**, que recebe as informações por meio de um servidor intermediário em **Node.js** e as apresenta em uma interface web.

### Funcionalidades

- Leitura de temperatura e umidade utilizando o sensor DHT22.
- Leitura de luminosidade utilizando um sensor LDR.
- Envio periódico das informações por MQTT.
- Visualização das mensagens recebidas no MyMQTT.
- Alteração remota do intervalo de leitura.
- Consulta do estado do dispositivo por meio de um comando MQTT.
- Encaminhamento das mensagens MQTT para o dashboard através de WebSocket.
- Visualização dos dados dos sensores em uma interface web.
- Exibição do estado da conexão e do horário da última atualização.

## 2. Tecnologias e ferramentas utilizadas

| Tecnologia | Finalidade |
|---|---|
| ESP32 | Controlador do sistema |
| Wokwi | Simulação do circuito e execução do código |
| DHT22 | Medição de temperatura e umidade |
| LDR | Medição da luminosidade |
| MQTT | Comunicação entre o dispositivo e o servidor |
| PubSubClient | Biblioteca Arduino para comunicação MQTT |
| DHT sensor library | Biblioteca para leitura do DHT22 |
| MyMQTT | Publicação e recebimento de mensagens MQTT |
| Node.js | Execução do servidor intermediário |
| MQTT.js | Comunicação do servidor Node.js com o broker MQTT |
| ws | Implementação da comunicação via WebSocket |
| React | Construção da interface web |
| Vite | Ambiente de desenvolvimento e execução do React |
| Tailwind CSS | Estilização da interface |

## 3. Estrutura dos arquivos

O repositório está organizado da seguinte maneira:

```text
VinheriaAgnello-ESP32/
├── Dashboard/
│   ├── server/
│   │   ├── server.js
│   │   ├── package.json
│   │   └── package-lock.json
│   │
│   ├── src/
│   │   ├── components/
│   │   │   └── LeiturasMQTT.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── .gitignore
├── README.md
├── diagram.json
├── libraries.txt
└── sketch.ino
```

### Descrição dos arquivos

- **`README.md`**: documentação e instruções para replicar o projeto.
- **`diagram.json`**: configuração do circuito simulado no Wokwi, incluindo o ESP32 e os sensores.
- **`libraries.txt`**: bibliotecas necessárias para executar o código do ESP32.
- **`sketch.ino`**: código-fonte do ESP32.
- **`Dashboard/`**: diretório que contém a aplicação web e o servidor Node.js.
- **`Dashboard/server/`**: servidor responsável por receber as mensagens MQTT e encaminhá-las via WebSocket.
- **`Dashboard/src/`**: código-fonte da aplicação React.
- **`Dashboard/src/components/`**: componentes da interface, incluindo o painel de leituras.
- **`Dashboard/package.json`**: dependências e scripts da aplicação React.
- **`Dashboard/server/package.json`**: dependências do servidor Node.js.

Os arquivos `package-lock.json` registram as versões das dependências instaladas em cada parte da aplicação.

## 4. Pré-requisitos

Antes de iniciar, é necessário ter:

- Acesso à internet.
- Uma conta no [Wokwi](https://wokwi.com/).
- O aplicativo [MyMQTT](https://mymqtt.app/) ou uma ferramenta equivalente para publicar e receber mensagens MQTT.
- [Node.js](https://nodejs.org/) instalado para executar o servidor e o dashboard.
- As bibliotecas `PubSubClient` e `DHT sensor library` disponíveis no ambiente de compilação do ESP32.

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

O broker deve estar acessível tanto pelo ESP32 simulado quanto pelo MyMQTT e pelo servidor Node.js. Se o endereço do broker mudar ou deixar de estar disponível, atualize a configuração nos dois lados.

A porta `1883` é normalmente utilizada para MQTT sem criptografia. Não utilize esse tipo de conexão para transmitir dados sensíveis em um ambiente de produção.

## 7. Instalação e execução do ESP32

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

## 8. Configuração do MyMQTT

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

## 9. Servidor intermediário Node.js

Para permitir que o dashboard React receba as mensagens MQTT, o projeto utiliza um servidor intermediário desenvolvido em Node.js.

O navegador não utiliza diretamente a conexão MQTT TCP convencional do broker. Em vez disso, o servidor Node.js mantém uma conexão MQTT, recebe as mensagens e as encaminha para a aplicação web por meio de WebSocket.

### Dependências

O servidor utiliza as seguintes dependências:

| Dependência | Finalidade |
|---|---|
| `mqtt` | Conectar ao broker MQTT e receber as mensagens publicadas pelo ESP32 |
| `ws` | Criar o servidor WebSocket para comunicação com o navegador |

### Instalação

Na raiz do repositório, abra um terminal e acesse a pasta do servidor:

```bash
cd Dashboard/server
```

Instale as dependências:

```bash
npm install
```

O comando utiliza o `package.json` e o `package-lock.json` para instalar as dependências necessárias.

### Execução

Ainda dentro de `Dashboard/server`, execute:

```bash
node server.js
```

Se tudo estiver funcionando corretamente, o terminal deverá apresentar mensagens semelhantes a:

```text
Servidor WebSocket iniciado na porta 8080
Conectado ao broker MQTT!
Inscrito no tópico /1ESPI/off-grid/attrs
```

Quando o React estabelecer uma conexão, também será exibido:

```text
React conectado ao servidor WebSocket!
```

Quando uma leitura for recebida:

```text
[MQTT] /1ESPI/off-grid/attrs: T:24.5 | H:60.2 | L:78.3
```

**Importante:** mantenha esse terminal aberto enquanto estiver utilizando o dashboard. O servidor Node.js precisa permanecer em execução para encaminhar as mensagens.

## 10. Dashboard React

O dashboard permite acompanhar as condições ambientais da adega por meio de uma interface web.

A aplicação recebe os dados do servidor Node.js através de WebSocket, interpreta as mensagens recebidas e atualiza automaticamente os valores apresentados na página.

### Dependências

As principais dependências utilizadas são:

| Dependência | Finalidade |
|---|---|
| `react` | Construção dos componentes e gerenciamento da interface |
| `react-dom` | Renderização da aplicação no navegador |
| `vite` | Servidor de desenvolvimento e ferramenta de build |
| `tailwindcss` | Estilização da interface com classes utilitárias |

O projeto também pode utilizar dependências adicionais de configuração do Vite e do Tailwind CSS, conforme registradas no `package.json`.

### Instalação

Abra um segundo terminal na raiz do repositório e acesse a pasta do dashboard:

```bash
cd Dashboard
```

Instale as dependências:

```bash
npm install
```

### Execução

Na mesma pasta, execute:

```bash
npm run dev
```

O Vite disponibilizará um endereço local, normalmente:

```text
http://localhost:5173
```

Acesse esse endereço no navegador para visualizar o dashboard.

### Funcionalidades do dashboard

A interface apresenta:

- **Temperatura:** valor atual em graus Celsius.
- **Umidade:** valor atual em porcentagem.
- **Luminosidade:** intensidade luminosa estimada em porcentagem.
- **Status da conexão:** informa se o navegador está conectado ao servidor WebSocket.
- **Última atualização:** horário em que a última leitura válida foi recebida.
- **Detalhes da mensagem:** permite consultar a última mensagem recebida pelo navegador.

Os valores são atualizados automaticamente conforme novas mensagens são recebidas.

## 11. Arquitetura e fluxo de comunicação

A comunicação entre os componentes acontece da seguinte maneira:

```text
┌─────────────────────────────┐
│       ESP32 - Wokwi         │
│                             │
│  DHT22       LDR            │
│    │          │             │
│    └────┬─────┘             │
│         │                   │
│    Leitura dos dados        │
└─────────┬───────────────────┘
          │
          │ MQTT
          ▼
┌─────────────────────────────┐
│        Broker MQTT          │
│                             │
│   3.135.234.101:1883        │
└─────────┬───────────────────┘
          │
          │ MQTT
          ▼
┌─────────────────────────────┐
│       Servidor Node.js      │
│                             │
│  Recebe mensagens MQTT      │
│  Encaminha via WebSocket    │
└─────────┬───────────────────┘
          │
          │ WebSocket
          ▼
┌─────────────────────────────┐
│       React + Vite          │
│                             │
│  Recebe e interpreta dados  │
│  Atualiza o dashboard       │
└─────────────────────────────┘
```

O fluxo pode ser resumido em quatro etapas:

1. O ESP32 realiza a leitura dos sensores e publica os dados no broker MQTT.
2. O servidor Node.js recebe as mensagens através do tópico `/1ESPI/off-grid/attrs`.
3. O Node.js encaminha as mensagens aos navegadores conectados via WebSocket.
4. O React interpreta os dados recebidos e atualiza os valores apresentados na interface.

O MyMQTT também pode se conectar diretamente ao broker para acompanhar as mensagens e enviar comandos ao ESP32.

## 12. Execução completa do projeto

Para executar o sistema completo, é necessário manter três processos ativos simultaneamente: a simulação do ESP32, o servidor Node.js e a aplicação React.

### Etapa 1 — Iniciar o ESP32

1. Abra o projeto no Wokwi.
2. Inicie a simulação.
3. Confira no monitor serial se o ESP32 conseguiu conectar ao Wi-Fi e ao broker MQTT.

### Etapa 2 — Iniciar o servidor Node.js

Abra um terminal na raiz do repositório e execute:

```bash
cd Dashboard/server
npm install
node server.js
```

Confira se o servidor conseguiu conectar ao broker MQTT e se realizou a inscrição no tópico `/1ESPI/off-grid/attrs`.

### Etapa 3 — Iniciar o dashboard React

Abra um segundo terminal na raiz do repositório:

```bash
cd Dashboard
npm install
npm run dev
```

Acesse o endereço disponibilizado pelo Vite, normalmente:

```text
http://localhost:5173
```

### Resultado esperado

Com os três processos funcionando:

- O ESP32 publica as leituras dos sensores.
- O Node.js recebe as mensagens MQTT.
- O servidor encaminha as mensagens via WebSocket.
- O dashboard apresenta os valores atualizados.

**Importante:** os terminais do Node.js e do Vite devem permanecer abertos enquanto a aplicação estiver sendo utilizada.

## 13. Formato das mensagens e comandos

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

**Importante:** as confirmações dos comandos e as leituras dos sensores são publicadas no mesmo tópico. Por isso, o MyMQTT e o servidor Node.js poderão receber os dois tipos de mensagem juntos. O dashboard identifica as mensagens de leitura pelo formato `T`, `H` e `L`, ignorando as mensagens de confirmação para fins de atualização dos sensores.

## 14. Como testar o funcionamento

Execute os testes a seguir para verificar se o projeto foi replicado corretamente.

### Teste 1 — Recebimento das leituras

1. Inicie a simulação no Wokwi.
2. Conecte o MyMQTT ao broker.
3. Inscreva-se no tópico `/1ESPI/off-grid/attrs`.
4. Verifique se as mensagens contendo temperatura, umidade e luminosidade aparecem periodicamente.
5. Inicie o servidor Node.js e confira se as mensagens também aparecem no terminal.
6. Abra o dashboard React e confira se os valores são apresentados.

**Resultado esperado:** recebimento de novas leituras aproximadamente a cada 10 segundos, enquanto esse for o intervalo configurado, tanto no MyMQTT quanto no dashboard.

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

## 15. Solução de problemas

| Problema | Possível solução |
|---|---|
| O ESP32 não conecta ao Wi-Fi | Verifique se está utilizando `Wokwi-GUEST` na simulação |
| O ESP32 não conecta ao broker | Confira o endereço IP, a porta, a disponibilidade do broker e a conectividade de rede |
| Nenhuma leitura aparece no MyMQTT | Verifique a conexão com o broker e a inscrição no tópico `/1ESPI/off-grid/attrs` |
| Os comandos não funcionam | Confirme se o ESP32 está inscrito em `/1ESPI/off-grid/cmd` e se o comando foi publicado nesse tópico |
| A leitura do DHT22 falha | Verifique as ligações, o pino DATA e a configuração do sensor no código |
| A luminosidade parece incorreta | Verifique o divisor de tensão, o pino analógico e a calibração utilizada na conversão |
| O servidor Node.js não conecta ao MQTT | Verifique o endereço do broker, a porta `1883` e as dependências instaladas |
| O servidor Node.js não recebe mensagens | Confira se o ESP32 está publicando no tópico correto |
| O React não conecta ao WebSocket | Verifique se o servidor Node.js está em execução e se a porta `8080` está disponível |
| Os valores aparecem como `--` no dashboard | Verifique se o servidor está encaminhando as mensagens e se elas seguem o formato esperado |
| O dashboard não atualiza | Confira os logs do navegador e do servidor Node.js |

## 16. Limitações e considerações

- O sistema depende da disponibilidade do broker MQTT utilizado.
- A luminosidade é representada por uma escala percentual estimada, não por uma medição calibrada em lux.
- O intervalo de leitura pode ser alterado apenas para os valores permitidos pelo código.
- O horário apresentado no dashboard corresponde ao recebimento da mensagem pelo navegador, não necessariamente ao instante exato em que o sensor realizou a leitura.
- O sistema não possui armazenamento histórico persistente das leituras.
- O servidor WebSocket utiliza `localhost:8080`, adequado para execução local. Para acessar a aplicação por outros dispositivos, será necessário adaptar o endereço e a configuração de rede.
- O projeto foi desenvolvido e testado em ambiente simulado no Wokwi; o funcionamento em hardware físico pode exigir ajustes nas ligações, na rede e na configuração do broker.
- A configuração apresentada não implementa autenticação MQTT ou criptografia da comunicação. Não deve ser exposta publicamente sem medidas adicionais de segurança.

## 17. Links

### Projeto Wokwi

| Link |
|:---:|
| [Clique aqui para acessar o projeto!](https://wokwi.com/projects/478515319809742849) |

### Vídeo de apresentação

| Link |
|:---:|
| [Clique aqui para assistir!](https://youtu.be/BYuYa6r6kFc) |

### Repositório GitHub

| Link |
|:---:|
| [VinheriaAgnello-ESP32](https://github.com/Off-Grid-Team/VinheriaAgnello-ESP32) |

## 18. Autores

Projeto acadêmico desenvolvido para a atividade de IoT relacionada ao monitoramento de uma adega da Vinheria Agnello.

| Nome | RM |
|:---|:---:|
| Felipe Rabelo | 570340 |
| Gustavo Ferreira Tavares | 569928 |
| Ricardo Salmerón | 572916 |
