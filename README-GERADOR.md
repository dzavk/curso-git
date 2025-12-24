# 🎬 Gerador de Roteiros Multilíngue

Aplicação web para gerar roteiros de vídeos em 5 idiomas diferentes usando a API do Google Gemini.

## 🌟 Funcionalidades

- ✨ Geração automática de roteiros usando IA (Google Gemini)
- 🌍 Suporte para 5 idiomas: Português, Espanhol, Inglês, Russo e Árabe
- 🎯 Cada roteiro é único, mas mantém o mesmo tema e propósito
- 💾 Salva suas configurações (API Key e Prompt customizado)
- 📋 Copie facilmente qualquer roteiro com um clique
- 🎨 Interface moderna e responsiva

## 🚀 Como Usar

### 1. Obter API Key do Google Gemini

1. Acesse [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. Copie a chave gerada

### 2. Configurar o Gerador

1. Abra o arquivo `gerador-roteiros.html` no seu navegador
2. Cole sua API Key no campo correspondente
3. (Opcional) Customize o prompt conforme sua necessidade
4. Clique em "💾 Salvar Prompt" para guardar suas configurações

### 3. Gerar Roteiros

1. Digite o título do seu vídeo no campo "Título do Roteiro"
2. Clique em "✨ Gerar Roteiros em 5 Idiomas"
3. Aguarde alguns segundos enquanto a IA gera os roteiros
4. Seus 5 roteiros únicos aparecerão na tela!

### 4. Copiar Roteiros

- Clique no botão "📋 Copiar" em qualquer roteiro para copiá-lo para a área de transferência
- Use os roteiros em seus projetos de vídeo!

## 🎨 Personalização do Prompt

O prompt é o texto que instrui a IA sobre como gerar os roteiros. Você pode personalizá-lo completamente!

### Placeholders Disponíveis

- `{titulo}` - Será substituído pelo título que você digitar
- `{idioma}` - Será substituído pelo idioma atual (português, espanhol, etc.)

### Exemplo de Prompt Customizado

```
Crie um roteiro de vídeo curto (2-3 minutos) sobre '{titulo}' em {idioma}.

Estrutura:
- Gancho inicial impactante (10 segundos)
- 3 pontos principais
- Call-to-action no final

Tom: casual e divertido, para público jovem.
```

### Dicas para Prompts Eficazes

- Seja específico sobre o formato desejado
- Defina a duração do vídeo
- Especifique o tom (formal, casual, educativo, etc.)
- Indique o público-alvo
- Mencione elementos importantes (gancho, CTA, etc.)

## 📁 Estrutura de Arquivos

```
├── gerador-roteiros.html    # Interface principal
├── app.js                   # Lógica da aplicação
├── styles.css              # Estilos e design
└── README-GERADOR.md       # Este arquivo
```

## 🔒 Segurança

- Sua API Key é armazenada apenas no seu navegador (localStorage)
- Nenhum dado é enviado para servidores externos além da API do Google
- A aplicação funciona 100% no cliente (frontend)

## 💡 Exemplos de Uso

### Para Canais Educativos
**Título:** "Física Quântica para Iniciantes"
- Gera roteiros adaptados para cada cultura
- Mantém o conteúdo educativo consistente
- Adapta exemplos e referências culturais

### Para Canais de Tecnologia
**Título:** "Como usar IA no seu negócio"
- Roteiros técnicos em múltiplos idiomas
- Exemplos práticos e aplicáveis
- Linguagem acessível em cada cultura

### Para Canais de Entretenimento
**Título:** "Top 10 Curiosidades sobre o Espaço"
- Conteúdo divertido e engajador
- Adaptado para diferentes audiências
- Mantém o impacto em todos os idiomas

## ❓ Solução de Problemas

### Erro "Invalid API Key"
- Verifique se copiou a chave completa
- Confirme que a API está ativa no Google AI Studio
- Tente gerar uma nova chave

### Roteiros muito curtos ou genéricos
- Refine seu prompt com mais detalhes
- Especifique a duração desejada
- Adicione exemplos do que você espera

### Demora muito para gerar
- Normal! A IA precisa criar 5 roteiros únicos
- Pode levar 30-60 segundos no total
- Não feche a página durante o processo

## 🌐 Idiomas Suportados

- 🇧🇷 **Português** - Português brasileiro
- 🇪🇸 **Espanhol** - Espanhol internacional
- 🇺🇸 **Inglês** - Inglês americano
- 🇷🇺 **Russo** - Russo
- 🇸🇦 **Árabe** - Árabe moderno padrão

## 📝 Licença

Este projeto é de código aberto. Use livremente para seus projetos!

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas!

---

Criado com ❤️ para criadores de conteúdo multilíngue
