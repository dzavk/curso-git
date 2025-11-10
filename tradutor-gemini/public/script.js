// ============================================
// ESTADO GLOBAL
// ============================================
let translations = {};
let currentFileContent = null;

// ============================================
// ELEMENTOS DO DOM
// ============================================
const apiKeyInput = document.getElementById('apiKey');
const selectAllBtn = document.getElementById('selectAll');
const translateBtn = document.getElementById('translateBtn');
const scriptTextArea = document.getElementById('scriptText');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const uploadZone = document.getElementById('uploadZone');
const fileInfo = document.getElementById('fileInfo');
const fileNameDisplay = document.getElementById('fileNameDisplay');
const removeFileBtn = document.getElementById('removeFileBtn');
const progressSection = document.getElementById('progressSection');
const resultsSection = document.getElementById('resultsSection');
const progressFill = document.getElementById('progressFill');
const progressPercent = document.getElementById('progressPercent');
const progressText = document.getElementById('progressText');
const translationResults = document.getElementById('translationResults');

// ============================================
// CARREGAR API KEY SALVA
// ============================================
window.addEventListener('load', () => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        apiKeyInput.value = savedKey;
    }
});

// Salvar API Key quando mudar
apiKeyInput.addEventListener('input', () => {
    localStorage.setItem('gemini_api_key', apiKeyInput.value);
});

// ============================================
// SELECIONAR TODOS OS IDIOMAS
// ============================================
selectAllBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.lang-item input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);

    checkboxes.forEach(cb => {
        cb.checked = !allChecked;
    });

    selectAllBtn.textContent = allChecked ? 'Todos' : 'Limpar';
});

// ============================================
// UPLOAD DE ARQUIVO
// ============================================

// Clicar no botão de procurar
browseBtn.addEventListener('click', () => {
    fileInput.click();
});

// Clicar na zona de upload
uploadZone.addEventListener('click', (e) => {
    if (e.target === uploadZone || e.target.closest('.upload-placeholder')) {
        fileInput.click();
    }
});

// Drag and drop
uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');

    if (e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
    }
});

// Quando selecionar arquivo
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// Processar arquivo
function handleFile(file) {
    // Verificar se é TXT
    if (!file.name.endsWith('.txt')) {
        alert('❌ Por favor, use apenas arquivos .txt!\n\nSe você tem um arquivo Word (.doc ou .docx), abra ele e copie o texto para o campo abaixo.');
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        currentFileContent = e.target.result;
        scriptTextArea.value = ''; // Limpar textarea

        // Mostrar info do arquivo
        document.querySelector('.upload-placeholder').style.display = 'none';
        fileInfo.style.display = 'flex';
        fileNameDisplay.textContent = file.name;
    };

    reader.onerror = () => {
        alert('❌ Erro ao ler o arquivo!');
    };

    reader.readAsText(file, 'UTF-8');
}

// Remover arquivo
removeFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    currentFileContent = null;
    fileInput.value = '';
    document.querySelector('.upload-placeholder').style.display = 'block';
    fileInfo.style.display = 'none';
});

// ============================================
// TRADUÇÃO
// ============================================

translateBtn.addEventListener('click', async () => {
    // Pegar dados
    const apiKey = apiKeyInput.value.trim();
    const selectedLanguages = getSelectedLanguages();
    const text = currentFileContent || scriptTextArea.value.trim();

    // Validações
    if (!apiKey) {
        alert('❌ Por favor, cole sua API Key do Gemini!');
        apiKeyInput.focus();
        return;
    }

    if (selectedLanguages.length === 0) {
        alert('❌ Por favor, selecione pelo menos um idioma!');
        return;
    }

    if (!text) {
        alert('❌ Por favor, cole um texto ou faça upload de um arquivo!');
        return;
    }

    // Iniciar tradução
    await startTranslation(apiKey, selectedLanguages, text);
});

function getSelectedLanguages() {
    const checkboxes = document.querySelectorAll('.lang-item input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => ({
        code: cb.value,
        name: cb.getAttribute('data-lang')
    }));
}

async function startTranslation(apiKey, languages, text) {
    // Resetar
    translations = {};
    resultsSection.style.display = 'none';
    progressSection.style.display = 'block';
    translateBtn.disabled = true;

    let completed = 0;
    const total = languages.length;

    // Traduzir cada idioma
    for (const language of languages) {
        progressText.textContent = `Traduzindo para ${language.name}...`;

        try {
            const response = await fetch('/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    apiKey,
                    text,
                    targetLanguage: language.code,
                    languageName: language.name
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro desconhecido');
            }

            const result = await response.json();
            translations[language.code] = {
                name: language.name,
                text: result.translation
            };

        } catch (error) {
            console.error(`Erro em ${language.name}:`, error);
            translations[language.code] = {
                name: language.name,
                text: `❌ Erro: ${error.message}`,
                error: true
            };
        }

        completed++;
        const percentage = Math.round((completed / total) * 100);
        progressFill.style.width = `${percentage}%`;
        progressPercent.textContent = `${percentage}%`;
    }

    // Concluído
    progressText.textContent = '✅ Traduções concluídas!';
    translateBtn.disabled = false;

    setTimeout(() => {
        progressSection.style.display = 'none';
        displayResults();
    }, 1500);
}

// ============================================
// EXIBIR RESULTADOS
// ============================================

function displayResults() {
    translationResults.innerHTML = '';

    Object.entries(translations).forEach(([code, data]) => {
        const item = document.createElement('div');
        item.className = 'translation-item';

        const preview = data.error
            ? `<p style="color: #ef4444; font-weight: 600;">${data.text}</p>`
            : data.text.substring(0, 250) + (data.text.length > 250 ? '...' : '');

        item.innerHTML = `
            <div class="translation-header">
                <h4 class="translation-title">${data.name}</h4>
            </div>
            <div class="translation-preview">${preview}</div>
            ${!data.error ? `
            <div class="translation-actions">
                <button class="btn-download" onclick="downloadSingle('${code}', 'txt')">
                    📄 TXT
                </button>
                <button class="btn-download" onclick="downloadSingle('${code}', 'docx')">
                    📘 DOCX
                </button>
                <button class="btn-download" onclick="downloadSingle('${code}', 'srt')">
                    🎬 SRT
                </button>
            </div>
            ` : ''}
        `;

        translationResults.appendChild(item);
    });

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ============================================
// DOWNLOADS
// ============================================

async function downloadSingle(languageCode, format) {
    const data = translations[languageCode];
    if (!data || data.error) return;

    try {
        const response = await fetch('/generate-file', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: data.text,
                language: data.name,
                format
            })
        });

        if (!response.ok) throw new Error('Erro ao gerar arquivo');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.name.toLowerCase().replace(/\s+/g, '_')}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Erro no download:', error);
        alert('❌ Erro ao baixar arquivo: ' + error.message);
    }
}

async function downloadAll(format) {
    const validTranslations = Object.entries(translations)
        .filter(([_, data]) => !data.error)
        .map(([code, data]) => ({
            language: data.name,
            text: data.text
        }));

    if (validTranslations.length === 0) {
        alert('❌ Nenhuma tradução válida para baixar');
        return;
    }

    try {
        const response = await fetch('/generate-all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                translations: validTranslations,
                format
            })
        });

        if (!response.ok) throw new Error('Erro ao gerar ZIP');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `todas_traducoes_${format}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Erro no download:', error);
        alert('❌ Erro ao baixar arquivos: ' + error.message);
    }
}
