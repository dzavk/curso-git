// Importar a biblioteca do Google Generative AI via CDN
import { GoogleGenerativeAI } from 'https://esm.run/@google/generative-ai';

// Prompt padrão
const PROMPT_PADRAO = `Crie um roteiro detalhado e profissional para um vídeo sobre '{titulo}' em {idioma}.

O roteiro deve conter:
- Introdução cativante (gancho inicial)
- Desenvolvimento com pontos principais bem estruturados
- Conclusão impactante com call-to-action
- Duração estimada: 5-7 minutos
- Tom: engajador e informativo

O roteiro deve ser único e criativo, diferente dos outros idiomas, mas mantendo o mesmo tema e propósito.`;

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

    try {
        // Inicializar API do Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Gerar roteiros para cada idioma
        const promessas = Object.keys(IDIOMAS).map(async (idiomaKey) => {
            const idioma = IDIOMAS[idiomaKey];
            const promptFinal = customPrompt
                .replace(/{titulo}/g, titulo)
                .replace(/{idioma}/g, idioma.nome);

            try {
                const result = await model.generateContent(promptFinal);
                const response = await result.response;
                const texto = response.text();

                return {
                    idioma: idiomaKey,
                    roteiro: texto,
                    sucesso: true
                };
            } catch (erro) {
                console.error(`Erro ao gerar roteiro em ${idioma.nome}:`, erro);
                return {
                    idioma: idiomaKey,
                    roteiro: `Erro ao gerar roteiro: ${erro.message}`,
                    sucesso: false
                };
            }
        });

        // Aguardar todos os roteiros serem gerados
        const resultados = await Promise.all(promessas);

        // Exibir resultados
        resultados.forEach(({ idioma, roteiro }) => {
            document.getElementById(`roteiro-${idioma}`).textContent = roteiro;
        });

        // Mostrar seção de resultados
        document.getElementById('loading').style.display = 'none';
        document.getElementById('results').style.display = 'block';

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
