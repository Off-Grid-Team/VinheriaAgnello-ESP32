
import { useEffect, useState } from "react";

export default function LeiturasMQTT() {
    const [leituras, setLeituras] = useState({
        temperatura: null,
        umidade: null,
        luminosidade: null,
    });

    const [status, setStatus] = useState("Conectando...");
    const [ultimaMensagem, setUltimaMensagem] = useState("");
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState("");

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080");

        socket.onopen = () => {
            setStatus("Conectado");
            console.log("Conectado ao servidor WebSocket!");
        };

        socket.onmessage = (evento) => {
            try {
                const dados = JSON.parse(evento.data);
                const texto = dados.mensagem;

                setUltimaMensagem(texto);

                const resultado = texto.match(
                    /T:\s*(-?\d+(?:\.\d+)?)\s*\|\s*H:\s*(-?\d+(?:\.\d+)?)\s*\|\s*L:\s*(-?\d+(?:\.\d+)?)/
                );

                if (!resultado) return;

                setLeituras({
                    temperatura: Number(resultado[1]),
                    umidade: Number(resultado[2]),
                    luminosidade: Number(resultado[3]),
                });

                setUltimaAtualizacao(
                    new Date().toLocaleTimeString("pt-BR")
                );
            } catch (erro) {
                console.error("Erro ao interpretar mensagem:", erro);
            }
        };

        socket.onerror = (erro) => {
            console.error("Erro WebSocket:", erro);
            setStatus("Erro de conexão");
        };

        socket.onclose = () => setStatus("Desconectado");

        return () => socket.close();
    }, []);

    const conectado = status === "Conectado";

    const sensores = [
        {
            nome: "Temperatura",
            valor: leituras.temperatura,
            unidade: "°C",
            descricao: "Temperatura ambiente",
            icone: "🌡️",
            cor: "text-orange-400",
            fundo: "bg-orange-400/10",
        },
        {
            nome: "Umidade",
            valor: leituras.umidade,
            unidade: "%",
            descricao: "Umidade relativa do ar",
            icone: "💧",
            cor: "text-sky-400",
            fundo: "bg-sky-400/10",
        },
        {
            nome: "Luminosidade",
            valor: leituras.luminosidade,
            unidade: "%",
            descricao: "Intensidade luminosa estimada",
            icone: "☀️",
            cor: "text-yellow-400",
            fundo: "bg-yellow-400/10",
        },
    ];

    return (
        <main className="min-h-screen bg-[#160d12] px-5 py-10 text-white sm:px-8">
            <div className="mx-auto max-w-6xl">

                {/* Cabeçalho */}
                <header className="mb-10 flex flex-col justify-between gap-5 border-b border-white/10 pb-7 sm:flex-row sm:items-center">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-rose-400">
                            Vinheria Agnello
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Monitoramento da Adega
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Acompanhamento em tempo real das condições ambientais.
                        </p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3 self-start rounded-full border border-white/10 bg-white/5 px-4 py-2 sm:self-center">
                        <span
                            className={`h-2.5 w-2.5 rounded-full ${conectado
                                    ? "bg-emerald-400 shadow-[0_0_10px_#34d399]"
                                    : "bg-red-400"
                                }`}
                        />

                        <span className="text-sm font-medium text-gray-200">
                            {status}
                        </span>
                    </div>
                </header>

                {/* Introdução */}
                <section className="mb-6">
                    <h2 className="text-xl font-semibold">
                        Condições ambientais
                    </h2>

                    <p className="mt-1 text-sm text-gray-400">
                        Dados recebidos diretamente dos sensores ESP32.
                    </p>
                </section>

                {/* Cartões dos sensores */}
                <section className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {sensores.map((sensor) => (
                        <article
                            key={sensor.nome}
                            className="rounded-2xl border border-white/10 bg-[#24151d] p-6 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-rose-400/40"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-400">
                                        {sensor.nome}
                                    </p>

                                    <p className="mt-5 text-4xl font-bold tracking-tight">
                                        {sensor.valor !== null
                                            ? sensor.valor.toFixed(1)
                                            : "--"}

                                        <span className="ml-1 text-xl text-gray-400">
                                            {sensor.unidade}
                                        </span>
                                    </p>
                                </div>

                                <div
                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${sensor.fundo}`}
                                >
                                    {sensor.icone}
                                </div>
                            </div>

                            <div className="mt-6 border-t border-white/10 pt-4">
                                <p className="text-xs text-gray-500">
                                    {sensor.descricao}
                                </p>
                            </div>
                        </article>
                    ))}
                </section>

                {/* Informações adicionais */}
                <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">

                    <article className="rounded-2xl border border-white/10 bg-[#24151d] p-6">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">🕒</span>
                            <h3 className="font-semibold">Última atualização</h3>
                        </div>

                        <p className="mt-4 text-2xl font-semibold">
                            {ultimaAtualizacao || "--:--:--"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Horário de recebimento dos dados
                        </p>
                    </article>

                    <article className="rounded-2xl border border-white/10 bg-[#24151d] p-6">
                        <div className="flex items-center gap-3">
                            <span className="text-xl">📡</span>
                            <h3 className="font-semibold">Comunicação</h3>
                        </div>

                        <p className="mt-4 text-lg font-semibold">
                            {conectado ? "Servidor WebSocket ativo" : "Sem conexão"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Comunicação entre o painel e o servidor Node.js
                        </p>
                    </article>
                </section>

                {/* Mensagem recebida */}
                <details className="mt-8 rounded-2xl border border-white/10 bg-[#24151d] p-6">
                    <summary className="cursor-pointer text-sm font-semibold text-gray-300 transition hover:text-white">
                        Detalhes da última mensagem recebida
                    </summary>

                    <pre className="mt-4 overflow-x-auto rounded-lg bg-black/30 p-4 text-sm text-emerald-300">
                        {ultimaMensagem || "Aguardando mensagens..."}
                    </pre>
                </details>

                {/* Rodapé */}
                <footer className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-gray-500">
                    Vinheria Agnello · Sistema de monitoramento IoT
                </footer>

            </div>
        </main>
    );
}
