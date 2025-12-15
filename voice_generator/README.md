# 🎙️ Gerador de Vozes - Edge TTS

Aplicativo web em Python para gerar múltiplos áudios a partir de roteiros usando Edge TTS (Microsoft Text-to-Speech).

## 📋 Características

- ✅ Interface web simples e intuitiva
- ✅ Suporte a múltiplos idiomas
- ✅ Geração de até 20 roteiros de uma vez
- ✅ Seleção automática de vozes compatíveis com o idioma escolhido
- ✅ Download individual de cada áudio gerado
- ✅ Vozes de alta qualidade gratuitas do Edge TTS
- ✅ Interface responsiva (funciona em desktop e mobile)

## 🚀 Instalação

### Pré-requisitos

- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)

### Passo a passo

1. **Clone ou navegue até o diretório do projeto:**
```bash
cd voice_generator
```

2. **Instale as dependências:**
```bash
pip install -r requirements.txt
```

## 📖 Como Usar

### 1. Iniciar o servidor

```bash
python app.py
```

Você verá uma mensagem similar a:
```
============================================================
🎙️  GERADOR DE VOZES COM EDGE TTS
============================================================

📝 Carregando vozes disponíveis...
✅ 400+ vozes carregadas com sucesso!

🌐 Iniciando servidor web...
📍 Acesse: http://localhost:5000

⌨️  Pressione CTRL+C para encerrar
```

### 2. Acessar a interface web

Abra seu navegador e acesse: **http://localhost:5000**

### 3. Gerar áudios

1. **Selecione o idioma** desejado (ex: Português, English, Español, etc.)
2. **Escolha uma voz** compatível com o idioma selecionado
3. **Adicione seus roteiros** (até 20 textos diferentes)
4. Clique em **"Gerar Todos os Áudios"**
5. **Baixe os áudios** gerados individualmente

## 🎯 Funcionalidades Detalhadas

### Seleção de Idioma
O sistema carrega automaticamente todos os idiomas disponíveis no Edge TTS, incluindo:
- Português (PT-BR, PT-PT)
- English (EN-US, EN-GB, EN-AU, etc.)
- Español (ES-ES, ES-MX, etc.)
- E muitos outros...

### Vozes
Ao selecionar um idioma, o sistema filtra e exibe apenas as vozes compatíveis com aquele idioma, mostrando:
- Nome da voz
- Gênero (Masculino/Feminino)
- Localização específica

### Múltiplos Roteiros
- Adicione ou remova campos de roteiro dinamicamente
- Cada roteiro será convertido em um arquivo MP3 separado
- Máximo de 20 roteiros por sessão
- Roteiros vazios são automaticamente ignorados

### Arquivos Gerados
Os áudios são salvos na pasta `outputs/` com nomenclatura:
- `audio_YYYYMMDD_HHMMSS_01.mp3`
- `audio_YYYYMMDD_HHMMSS_02.mp3`
- etc.

## 🗂️ Estrutura do Projeto

```
voice_generator/
│
├── app.py                 # Aplicação Flask principal
├── requirements.txt       # Dependências Python
├── README.md             # Documentação
│
├── templates/
│   └── index.html        # Interface web
│
├── static/               # Arquivos estáticos (vazio por enquanto)
│
└── outputs/              # Áudios gerados são salvos aqui
    └── audio_*.mp3
```

## 🔧 API Endpoints

### GET `/`
Página principal da aplicação

### GET `/api/languages`
Retorna lista de idiomas disponíveis

### GET `/api/voices?language=<code>`
Retorna vozes filtradas por idioma

**Parâmetros:**
- `language`: Código do idioma (ex: pt-BR, en-US)

### POST `/api/generate`
Gera múltiplos áudios

**Body (JSON):**
```json
{
  "scripts": ["texto 1", "texto 2", ...],
  "voice": "pt-BR-FranciscaNeural",
  "language": "pt-BR"
}
```

### GET `/api/download/<filename>`
Download de arquivo de áudio gerado

## 🌍 Idiomas Suportados

O Edge TTS suporta mais de 100 idiomas e variantes, incluindo:

- **Português**: PT-BR (Brasil), PT-PT (Portugal)
- **English**: EN-US, EN-GB, EN-AU, EN-CA, EN-IN, etc.
- **Español**: ES-ES, ES-MX, ES-AR, ES-CO, etc.
- **Français**: FR-FR, FR-CA
- **Deutsch**: DE-DE, DE-AT, DE-CH
- **Italiano**: IT-IT
- **日本語**: JA-JP
- **한국어**: KO-KR
- **中文**: ZH-CN, ZH-TW, ZH-HK
- **Русский**: RU-RU
- **العربية**: AR-SA, AR-EG, etc.
- E muitos outros...

## 🎨 Interface

A interface é moderna e responsiva, com:
- Design gradiente atraente
- Campos de texto dimensionáveis
- Feedback visual durante geração
- Indicadores de progresso
- Botões de download direto
- Compatibilidade mobile

## ⚙️ Configuração Avançada

### Alterar a porta do servidor

Edite o arquivo `app.py`, linha final:

```python
app.run(debug=True, host='0.0.0.0', port=5000)  # Altere 5000 para sua porta
```

### Aumentar limite de roteiros

No arquivo `templates/index.html`, altere a constante:

```javascript
const MAX_SCRIPTS = 20;  // Altere para o número desejado
```

## 🐛 Solução de Problemas

### Erro: "No module named 'edge_tts'"
```bash
pip install edge-tts
```

### Erro: "Address already in use"
Outra aplicação está usando a porta 5000. Altere a porta no `app.py` ou encerre o processo:
```bash
# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Vozes não carregam
Verifique sua conexão com a internet. O Edge TTS requer conexão para buscar as vozes disponíveis.

## 📝 Notas

- **Gratuito**: Edge TTS é um serviço gratuito da Microsoft
- **Qualidade**: Vozes neurais de alta qualidade
- **Limite**: Não há limite oficial, mas use com responsabilidade
- **Offline**: Requer conexão com internet para gerar áudios

## 🤝 Contribuindo

Sugestões e melhorias são bem-vindas!

## 📄 Licença

Este projeto é fornecido "como está" para uso educacional e pessoal.

## 🙏 Créditos

- **Edge TTS**: Microsoft Azure Cognitive Services
- **Flask**: Framework web Python
- **Interface**: Design personalizado

---

**Desenvolvido com ❤️ usando Python e Edge TTS**
