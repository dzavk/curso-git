// Importar a biblioteca do Google Generative AI via CDN
import { GoogleGenerativeAI } from 'https://esm.run/@google/generative-ai';

// Prompt padrão para roteiros longos
const PROMPT_PADRAO = `Crie um roteiro EXTENSO e DETALHADO para um vídeo sobre '{titulo}' em {idioma}.

O roteiro deve ter aproximadamente 5000-10000 palavras e conter:
- Introdução cativante e elaborada (gancho inicial forte)
- Desenvolvimento profundo com múltiplos pontos principais bem detalhados
- Exemplos práticos e histórias
- Transições suaves entre seções
- Conclusão impactante com call-to-action
- Tom: engajador, profissional e informativo

O roteiro deve ser único e criativo, diferente dos outros idiomas, mas mantendo o mesmo tema e propósito.
IMPORTANTE: Este é um roteiro LONGO e COMPLETO, não economize em detalhes.`;

// Idiomas suportados
const IDIOMAS = {
    portugues: { nome: 'português brasileiro', flag: '🇧🇷' },
    espanhol: { nome: 'espanhol', flag: '🇪🇸' },
    ingles: { nome: 'inglês', flag: '🇺🇸' },
    russo: { nome: 'russo', flag: '🇷🇺' },
    arabe: { nome: 'árabe', flag: '🇸🇦' }
};

// Carregar configurações salvas ao iniciar
window.addEventListener('DOMContentLoaded', () => {
    carregarConfiguracoes();
});

// Carregar configurações do localStorage
function carregarConfiguracoes() {
    const apiKeySalva = localStorage.getItem('gemini_api_key');
    const promptSalvo = localStorage.getItem('custom_prompt');

    if (apiKeySalva) {
        document.getElementById('apiKey').value = apiKeySalva;
    }

    if (promptSalvo) {
        document.getElementById('customPrompt').value = promptSalvo;
    } else {
        document.getElementById('customPrompt').value = PROMPT_PADRAO;
    }
}

// Salvar prompt customizado
window.salvarPrompt = function() {
    const prompt = document.getElementById('customPrompt').value.trim();

    if (!prompt) {
        alert('Por favor, digite um prompt antes de salvar.');
        return;
    }

    localStorage.setItem('custom_prompt', prompt);
    alert('✅ Prompt salvo com sucesso!');
};

// Resetar para prompt padrão
window.resetarPrompt = function() {
    if (confirm('Deseja resetar para o prompt padrão? O prompt atual será perdido.')) {
        document.getElementById('customPrompt').value = PROMPT_PADRAO;
        localStorage.removeItem('custom_prompt');
        alert('✅ Prompt resetado para o padrão!');
    }
};

// Atualizar mensagem de progresso
function atualizarProgresso(mensagem) {
    const loadingElement = document.getElementById('loading');
    let progressText = loadingElement.querySelector('p');
    if (progressText) {
        progressText.innerHTML = mensagem;
    }
}

// Função para gerar um roteiro longo em 2 partes
async function gerarRoteiroLongo(model, titulo, customPrompt, idioma) {
    // PARTE 1: Gerar primeira metade do roteiro
    atualizarProgresso(`🎬 Gerando ${idioma.flag} ${idioma.nome} - Parte 1/2...`);

    const promptParte1 = customPrompt
        .replace(/{titulo}/g, titulo)
        .replace(/{idioma}/g, idioma.nome) +
        `\n\nIMPORTANTE: Esta é a PRIMEIRA PARTE do roteiro. Crie a introdução completa e a primeira metade do desenvolvimento.
        Termine em um ponto natural, mas SEM concluir o roteiro. A segunda parte continuará daqui.
        Escreva aproximadamente 4000-5000 palavras nesta primeira parte.`;

    const resultParte1 = await model.generateContent(promptParte1);
    const responseParte1 = await resultParte1.response;
    const textoParte1 = responseParte1.text();

    // Pequena pausa entre as requisições
    await new Promise(resolve => setTimeout(resolve, 1000));

    // PARTE 2: Continuar e finalizar o roteiro
    atualizarProgresso(`🎬 Gerando ${idioma.flag} ${idioma.nome} - Parte 2/2...`);

    const promptParte2 = `Continue e FINALIZE o roteiro sobre '${titulo}' em ${idioma.nome}.

Esta é a SEGUNDA E ÚLTIMA PARTE do roteiro.

Aqui está a primeira parte que você já escreveu:

---
${textoParte1}
---

Agora CONTINUE de onde parou e complete o roteiro com:
- Continuação natural do desenvolvimento
- Todos os pontos restantes importantes
- Conclusão impactante e completa
- Call-to-action final

Escreva aproximadamente 4000-5000 palavras nesta segunda parte para completar o roteiro.
NÃO repita o que já foi escrito, apenas CONTINUE e FINALIZE.`;

    const resultParte2 = await model.generateContent(promptParte2);
    const responseParte2 = await resultParte2.response;
    const textoParte2 = responseParte2.text();

    // Juntar as duas partes
    const roteiroCompleto = textoParte1 + '\n\n' + textoParte2;

    return roteiroCompleto;
}

// Função principal para gerar roteiros
window.gerarRoteiros = async function() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const titulo = document.getElementById('titulo').value.trim();
    const customPrompt = document.getElementById('customPrompt').value.trim();

    // Validações
    if (!apiKey) {
        alert('⚠️ Por favor, insira sua API Key do Google Gemini.');
        return;
    }

    if (!titulo) {
        alert('⚠️ Por favor, insira um título para o roteiro.');
        return;
    }

    if (!customPrompt) {
        alert('⚠️ Por favor, configure um prompt.');
        return;
    }

    // Salvar API Key para uso futuro
    localStorage.setItem('gemini_api_key', apiKey);

    // Mostrar loading
    document.getElementById('loading').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    atualizarProgresso('🚀 Iniciando geração de roteiros longos...');

    try {
        // Inicializar API do Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Gerar roteiros para cada idioma SEQUENCIALMENTE (um por vez)
        const resultados = [];

        for (const idiomaKey of Object.keys(IDIOMAS)) {
            const idioma = IDIOMAS[idiomaKey];

            try {
                const roteiroCompleto = await gerarRoteiroLongo(model, titulo, customPrompt, idioma);

                resultados.push({
                    idioma: idiomaKey,
                    roteiro: roteiroCompleto,
                    sucesso: true
                });

                // Exibir o roteiro assim que estiver pronto
                document.getElementById(`roteiro-${idiomaKey}`).textContent = roteiroCompleto;

                // Mostrar resultados parciais
                document.getElementById('results').style.display = 'block';

            } catch (erro) {
                console.error(`Erro ao gerar roteiro em ${idioma.nome}:`, erro);
                resultados.push({
                    idioma: idiomaKey,
                    roteiro: `❌ Erro ao gerar roteiro: ${erro.message}`,
                    sucesso: false
                });
                document.getElementById(`roteiro-${idiomaKey}`).textContent = `❌ Erro: ${erro.message}`;
            }

            // Pausa entre idiomas para não sobrecarregar a API
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Finalizar
        document.getElementById('loading').style.display = 'none';
        document.getElementById('results').style.display = 'block';

        atualizarProgresso('✅ Todos os roteiros foram gerados!');

        // Scroll suave até os resultados
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });

    } catch (erro) {
        console.error('Erro geral:', erro);
        alert(`❌ Erro ao gerar roteiros: ${erro.message}\n\nVerifique se sua API Key está correta.`);
        document.getElementById('loading').style.display = 'none';
    }
};

// Função para copiar roteiro
window.copiarRoteiro = async function(idioma) {
    const conteudo = document.getElementById(`roteiro-${idioma}`).textContent;

    if (!conteudo) {
        alert('⚠️ Nenhum roteiro para copiar.');
        return;
    }

    try {
        await navigator.clipboard.writeText(conteudo);

        // Feedback visual
        const botao = event.target;
        const textoOriginal = botao.textContent;
        botao.textContent = '✅ Copiado!';
        botao.style.background = '#2196F3';

        setTimeout(() => {
            botao.textContent = textoOriginal;
            botao.style.background = '#4CAF50';
        }, 2000);

    } catch (erro) {
        console.error('Erro ao copiar:', erro);
        alert('❌ Erro ao copiar. Tente selecionar manualmente o texto.');
    }
};
