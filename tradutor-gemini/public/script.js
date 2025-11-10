// Estado da aplicação
let translations = {};
let currentFile = null;

// Elementos do DOM
const apiKeyInput = document.getElementById('apiKey');
const selectAllBtn = document.getElementById('selectAll');
const translateBtn = document.getElementById('translateBtn');
const scriptTextArea = document.getElementById('scriptText');
const fileInput = document.getElementById('fileInput');
const fileUploadArea = document.getElementById('fileUploadArea');
const fileName = document.getElementById('fileName');
const progressSection = document.getElementById('progressSection');
const resultsSection = document.getElementById('resultsSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const translationResults = document.getElementById('translationResults');

// Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const textTab = document.getElementById('textTab');
const fileTab = document.getElementById('fileTab');

// Alternar tabs
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (tabName === 'text') {
            textTab.classList.add('active');
            fileTab.classList.remove('active');
            currentFile = null;
        } else {
            textTab.classList.remove('active');
            fileTab.classList.add('active');
            scriptTextArea.value = '';
        }
    });
});

// Selecionar todos os idiomas
selectAllBtn.addEventListener('click', () => {
    const checkboxes = document.querySelectorAll('.language-checkbox input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);

    checkboxes.forEach(cb => {
        cb.checked = !allChecked;
    });

    selectAllBtn.textContent = allChecked ? 'Selecionar Todos' : 'Desmarcar Todos';
});

// Upload de arquivo
fileUploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileUploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileUploadArea.classList.add('dragover');
});

fileUploadArea.addEventListener('dragleave', () => {
    fileUploadArea.classList.remove('dragover');
});

fileUploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileUploadArea.classList.remove('dragover');

    if (e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

function handleFileSelect(file) {
    const reader = new FileReader();

    reader.onload = (e) => {
        currentFile = {
            name: file.name,
            content: e.target.result
        };
        fileName.textContent = `📎 ${file.name}`;
        fileName.classList.add('show');
    };

    reader.readAsText(file);
}

// Botão de tradução
translateBtn.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    const selectedLanguages = getSelectedLanguages();
    const text = currentFile ? currentFile.content : scriptTextArea.value.trim();

    // Validações
    if (!apiKey) {
        alert('❌ Por favor, insira sua API Key do Gemini!');
        return;
    }

    if (selectedLanguages.length === 0) {
        alert('❌ Por favor, selecione pelo menos um idioma!');
        return;
    }

    if (!text) {
        alert('❌ Por favor, insira um texto ou faça upload de um arquivo!');
        return;
    }

    // Iniciar tradução
    await startTranslation(apiKey, selectedLanguages, text);
});

function getSelectedLanguages() {
    const checkboxes = document.querySelectorAll('.language-checkbox input[type="checkbox"]:checked');
    return Array.from(checkboxes).map(cb => ({
        code: cb.value,
        name: cb.getAttribute('data-lang')
    }));
}

async function startTranslation(apiKey, languages, text) {
    // Limpar resultados anteriores
    translations = {};
    resultsSection.style.display = 'none';

    // Mostrar progresso
    progressSection.style.display = 'block';
    translateBtn.disabled = true;

    let completed = 0;
    const total = languages.length;

    for (const language of languages) {
        progressText.textContent = `Traduzindo para ${language.name}...`;

        try {
            const response = await fetch('http://localhost:3000/translate', {
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
                throw new Error(`Erro ao traduzir para ${language.name}`);
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
                text: `Erro ao traduzir: ${error.message}`,
                error: true
            };
        }

        completed++;
        const percentage = Math.round((completed / total) * 100);
        progressFill.style.width = `${percentage}%`;
    }

    // Concluído
    progressText.textContent = '✅ Todas as traduções concluídas!';
    translateBtn.disabled = false;

    setTimeout(() => {
        progressSection.style.display = 'none';
        displayResults();
    }, 1000);
}

function displayResults() {
    translationResults.innerHTML = '';

    Object.entries(translations).forEach(([code, data]) => {
        const item = document.createElement('div');
        item.className = 'translation-item';

        const preview = data.error
            ? `<p style="color: var(--danger-color);">${data.text}</p>`
            : data.text.substring(0, 300) + (data.text.length > 300 ? '...' : '');

        item.innerHTML = `
            <div class="translation-header">
                <h4 class="translation-title">${data.name}</h4>
            </div>
            <div class="translation-preview">${preview}</div>
            ${!data.error ? `
            <div class="translation-actions">
                <button class="btn-download" onclick="downloadSingle('${code}', 'txt')">
                    <span>📄</span> TXT
                </button>
                <button class="btn-download" onclick="downloadSingle('${code}', 'docx')">
                    <span>📘</span> DOCX
                </button>
                <button class="btn-download" onclick="downloadSingle('${code}', 'srt')">
                    <span>🎬</span> SRT
                </button>
            </div>
            ` : ''}
        `;

        translationResults.appendChild(item);
    });

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Download individual
async function downloadSingle(languageCode, format) {
    const data = translations[languageCode];
    if (!data || data.error) return;

    try {
        const response = await fetch('http://localhost:3000/generate-file', {
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
        a.download = `traducao_${data.name.toLowerCase()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Erro no download:', error);
        alert('❌ Erro ao baixar arquivo');
    }
}

// Download de todos
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
        const response = await fetch('http://localhost:3000/generate-all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                translations: validTranslations,
                format
            })
        });

        if (!response.ok) throw new Error('Erro ao gerar arquivo');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `todas_traducoes.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

    } catch (error) {
        console.error('Erro no download:', error);
        alert('❌ Erro ao baixar arquivos');
    }
}

// Salvar API Key no localStorage
apiKeyInput.addEventListener('change', () => {
    localStorage.setItem('gemini_api_key', apiKeyInput.value);
});

// Carregar API Key salva
window.addEventListener('load', () => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
        apiKeyInput.value = savedKey;
    }
});
