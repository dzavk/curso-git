# 🌍 Tradutor Adaptivo Gemini

Aplicação web para traduzir roteiros e documentos para múltiplos idiomas usando a API do Google Gemini.

## ✨ Funcionalidades

- 🗣️ **10 idiomas disponíveis**: Espanhol, Inglês, Russo, Árabe, Turco, Polonês, Alemão, Francês, Italiano e Romeno
- 📝 **Múltiplas formas de entrada**: Cole texto diretamente ou faça upload de arquivos (TXT, DOC, DOCX, SRT)
- 📥 **Múltiplos formatos de saída**: Baixe as traduções em TXT, DOCX ou SRT
- 🎬 **Otimizado para CapCut**: Arquivos SRT divididos em blocos de 400 caracteres
- 💾 **Download em lote**: Baixe todas as traduções de uma vez em arquivo ZIP
- 🎨 **Interface moderna e intuitiva**: Design responsivo e fácil de usar
- 🔒 **Privacidade**: Sua API key é salva apenas no navegador

## 🚀 Como Usar

### Pré-requisitos

- Node.js (versão 14 ou superior)
- Uma API Key do Google Gemini ([obtenha aqui](https://makersuite.google.com/app/apikey))

### Instalação

1. **Clone ou navegue até a pasta do projeto**:
```bash
cd tradutor-gemini
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Inicie o servidor**:
```bash
npm start
```

4. **Abra no navegador**:
```
http://localhost:3000
```

### Modo Desenvolvedor

Para desenvolvimento com auto-reload:
```bash
npm run dev
```

## 📖 Guia de Uso

1. **Insira sua API Key do Gemini**
   - Cole sua chave no campo indicado
   - A chave será salva automaticamente no navegador

2. **Selecione os idiomas**
   - Marque os idiomas para os quais deseja traduzir
   - Use o botão "Selecionar Todos" para marcar/desmarcar todos

3. **Insira o texto**
   - **Opção 1**: Cole o texto na aba "Colar Texto"
   - **Opção 2**: Faça upload de um arquivo na aba "Fazer Upload"

4. **Clique em "Traduzir Agora"**
   - Acompanhe o progresso da tradução
   - Aguarde a conclusão de todas as traduções

5. **Baixe os resultados**
   - **Download individual**: Escolha o idioma e formato (TXT, DOCX ou SRT)
   - **Download em lote**: Baixe todos os idiomas de uma vez em ZIP

## 📁 Formatos de Saída

### TXT
- Arquivo de texto simples
- Ideal para edição rápida

### DOCX
- Documento Word formatado
- Inclui título com o idioma
- Parágrafos separados corretamente

### SRT
- Formato de legendas
- **Dividido em blocos de 400 caracteres**
- Perfeito para importar no CapCut
- Cada bloco tem 3 segundos de duração
- Numeração e timestamps automáticos

## 🎬 Usando com CapCut

Os arquivos SRT são divididos em blocos de 400 caracteres (abaixo do limite de 500 do CapCut):

1. Baixe o arquivo SRT do idioma desejado
2. Importe no CapCut como legenda
3. O texto estará dividido em partes prontas para gerar áudio
4. Cada parte tem no máximo 400 caracteres

## 🔧 Estrutura do Projeto

```
tradutor-gemini/
├── public/              # Frontend
│   ├── index.html      # Interface principal
│   ├── styles.css      # Estilos
│   └── script.js       # Lógica do cliente
├── server/             # Backend
│   └── index.js        # Servidor Express + API
├── package.json        # Dependências
└── README.md           # Este arquivo
```

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express
- **IA**: Google Gemini API
- **Geração de arquivos**: docx, jszip

## 🔐 Segurança

- A API key é armazenada apenas no navegador (localStorage)
- Nenhum dado é salvo no servidor
- Todas as traduções são processadas em tempo real
- Sem banco de dados ou armazenamento persistente

## ⚠️ Limitações

- Requer conexão com internet
- Depende da disponibilidade da API do Gemini
- Limite de caracteres por requisição da API do Gemini
- Para textos muito longos, pode levar alguns minutos

## 📝 Dicas

- Para traduções mais precisas, forneça contexto no início do texto
- Divida textos muito longos em partes menores se necessário
- Revise as traduções, especialmente para idiomas com alfabetos diferentes
- Guarde sua API key em local seguro

## 🐛 Problemas Comuns

**Erro de API Key inválida**
- Verifique se a chave está correta
- Certifique-se de que a API do Gemini está ativada na sua conta Google

**Tradução demora muito**
- Textos longos podem levar vários minutos
- Aguarde ou divida o texto em partes menores

**Arquivo não abre**
- Certifique-se de ter o programa adequado instalado
- Para DOCX: Microsoft Word, Google Docs, LibreOffice

## 📄 Licença

MIT License - Uso livre para projetos pessoais e comerciais

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas!

---

Feito com ❤️ usando Google Gemini AI
