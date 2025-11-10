const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Document, Paragraph, Packer } = require('docx');
const JSZip = require('jszip');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Mapeamento de códigos de idioma para nomes completos
const languageNames = {
    'es': 'Spanish',
    'en': 'English',
    'ru': 'Russian',
    'ar': 'Arabic',
    'tr': 'Turkish',
    'pl': 'Polish',
    'de': 'German',
    'fr': 'French',
    'it': 'Italian',
    'ro': 'Romanian'
};

// Endpoint de tradução
app.post('/translate', async (req, res) => {
    try {
        const { apiKey, text, targetLanguage, languageName } = req.body;

        if (!apiKey || !text || !targetLanguage) {
            return res.status(400).json({ error: 'Parâmetros inválidos' });
        }

        // Inicializar Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Criar prompt de tradução
        const fullLanguageName = languageNames[targetLanguage] || languageName;
        const prompt = `Translate the following Portuguese text to ${fullLanguageName}.

IMPORTANT: Return ONLY the translation, without any explanations, notes, or additional text.

Text to translate:
${text}`;

        // Fazer a tradução
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const translation = response.text();

        res.json({ translation: translation.trim() });

    } catch (error) {
        console.error('Erro na tradução:', error);
        res.status(500).json({
            error: 'Erro ao traduzir',
            message: error.message
        });
    }
});

// Função para dividir texto em chunks de 400 caracteres para SRT
function splitTextForSRT(text, maxChars = 400) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
        const trimmedSentence = sentence.trim();

        if ((currentChunk + ' ' + trimmedSentence).length <= maxChars) {
            currentChunk += (currentChunk ? ' ' : '') + trimmedSentence;
        } else {
            if (currentChunk) {
                chunks.push(currentChunk);
            }

            // Se a sentença for maior que maxChars, dividi-la
            if (trimmedSentence.length > maxChars) {
                const words = trimmedSentence.split(' ');
                let wordChunk = '';

                for (const word of words) {
                    if ((wordChunk + ' ' + word).length <= maxChars) {
                        wordChunk += (wordChunk ? ' ' : '') + word;
                    } else {
                        if (wordChunk) {
                            chunks.push(wordChunk);
                        }
                        wordChunk = word;
                    }
                }

                if (wordChunk) {
                    currentChunk = wordChunk;
                } else {
                    currentChunk = '';
                }
            } else {
                currentChunk = trimmedSentence;
            }
        }
    }

    if (currentChunk) {
        chunks.push(currentChunk);
    }

    return chunks;
}

// Função para gerar arquivo SRT
function generateSRT(text) {
    const chunks = splitTextForSRT(text);
    let srtContent = '';

    chunks.forEach((chunk, index) => {
        const startTime = formatSRTTime(index * 3);
        const endTime = formatSRTTime((index + 1) * 3);

        srtContent += `${index + 1}\n`;
        srtContent += `${startTime} --> ${endTime}\n`;
        srtContent += `${chunk}\n\n`;
    });

    return srtContent;
}

// Formatar tempo para SRT (HH:MM:SS,mmm)
function formatSRTTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
}

// Função para gerar arquivo TXT
function generateTXT(text) {
    return text;
}

// Função para gerar arquivo DOCX
async function generateDOCX(text, language) {
    const paragraphs = text.split('\n').map(line =>
        new Paragraph({
            text: line,
            spacing: { after: 200 }
        })
    );

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: `Tradução - ${language}`,
                    heading: 'Heading1',
                    spacing: { after: 400 }
                }),
                ...paragraphs
            ]
        }]
    });

    return await Packer.toBuffer(doc);
}

// Endpoint para gerar arquivo individual
app.post('/generate-file', async (req, res) => {
    try {
        const { text, language, format } = req.body;

        if (!text || !format) {
            return res.status(400).json({ error: 'Parâmetros inválidos' });
        }

        let fileContent;
        let contentType;
        let filename = `traducao_${language.toLowerCase()}.${format}`;

        switch (format) {
            case 'txt':
                fileContent = generateTXT(text);
                contentType = 'text/plain';
                break;

            case 'docx':
                fileContent = await generateDOCX(text, language);
                contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
                break;

            case 'srt':
                fileContent = generateSRT(text);
                contentType = 'application/x-subrip';
                break;

            default:
                return res.status(400).json({ error: 'Formato inválido' });
        }

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(fileContent);

    } catch (error) {
        console.error('Erro ao gerar arquivo:', error);
        res.status(500).json({
            error: 'Erro ao gerar arquivo',
            message: error.message
        });
    }
});

// Endpoint para gerar todos os arquivos em ZIP
app.post('/generate-all', async (req, res) => {
    try {
        const { translations, format } = req.body;

        if (!translations || !Array.isArray(translations) || !format) {
            return res.status(400).json({ error: 'Parâmetros inválidos' });
        }

        const zip = new JSZip();

        // Gerar cada arquivo e adicionar ao ZIP
        for (const translation of translations) {
            const { language, text } = translation;
            let fileContent;
            let filename = `traducao_${language.toLowerCase()}.${format}`;

            switch (format) {
                case 'txt':
                    fileContent = generateTXT(text);
                    break;

                case 'docx':
                    fileContent = await generateDOCX(text, language);
                    break;

                case 'srt':
                    fileContent = generateSRT(text);
                    break;

                default:
                    continue;
            }

            zip.file(filename, fileContent);
        }

        // Gerar ZIP
        const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', 'attachment; filename="todas_traducoes.zip"');
        res.send(zipBuffer);

    } catch (error) {
        console.error('Erro ao gerar ZIP:', error);
        res.status(500).json({
            error: 'Erro ao gerar ZIP',
            message: error.message
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📁 Acesse a aplicação no navegador`);
});
