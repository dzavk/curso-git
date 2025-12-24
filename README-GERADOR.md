# 🎬 Gerador de Roteiros Multilíngue

Aplicação web para gerar roteiros LONGOS de vídeos em 5 idiomas diferentes usando a API do Google Gemini.

## 🌟 Funcionalidades

- ✨ Geração automática de roteiros EXTENSOS usando IA (Google Gemini)
- 🚀 **Sistema Inteligente em 2 Etapas**: Gera roteiros de até 10.000 palavras
- 🌍 Suporte para 5 idiomas: Português, Espanhol, Inglês, Russo e Árabe
- 🎯 Cada roteiro é único, mas mantém o mesmo tema e propósito
- 💾 Salva suas configurações (API Key e Prompt customizado)
- 📋 Copie facilmente qualquer roteiro com um clique
- 🎨 Interface moderna e responsiva
- 📊 Indicador de progresso em tempo real

## 🧠 Como Funciona o Sistema de 2 Etapas

O gerador usa uma tecnologia inteligente para criar roteiros muito longos (até 10.000 palavras):

### Processo de Geração:

1. **Etapa 1 - Primeira Metade (4.000-5.000 palavras)**
   - O sistema gera a introdução completa
   - Desenvolve a primeira metade do conteúdo
   - Para em um ponto natural, sem concluir

2. **Etapa 2 - Continuação e Finalização (4.000-5.000 palavras)**
   - O sistema recebe a primeira parte como contexto
   - Continua de onde parou naturalmente
   - Completa o desenvolvimento
   - Adiciona conclusão impactante e call-to-action

3. **Entrega Final**
   - As duas partes são automaticamente unidas
   - Você recebe o roteiro completo de uma só vez
   - Total: 8.000-10.000 palavras por roteiro

### Por que 2 Etapas?

- ✅ Contorna limitações de tamanho da IA
- ✅ Garante qualidade em roteiros longos
- ✅ Mantém consistência narrativa
- ✅ Você recebe tudo pronto, sem precisar fazer nada

### Tempo de Geração:

- 📝 **Por idioma**: 3-5 minutos (2 etapas + processamento)
- 🌍 **Total (5 idiomas)**: ~15-25 minutos
- ⏰ Os roteiros aparecem conforme ficam prontos!

---

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
- Defina a duração do vídeo ou quantidade de palavras
- Especifique o tom (formal, casual, educativo, etc.)
- Indique o público-alvo
- Mencione elementos importantes (gancho, CTA, etc.)
- Para roteiros longos, peça detalhes, exemplos e histórias
- Use palavras como "EXTENSO", "DETALHADO", "COMPLETO"

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

## 📝 Melhores Práticas para Roteiros Longos

### Otimizando Seu Prompt

Para roteiros de 8.000-10.000 palavras, considere incluir:

```
Crie um roteiro EXTENSO e COMPLETO sobre '{titulo}' em {idioma}.

Duração esperada: 30-45 minutos de conteúdo
Palavras: aproximadamente 8.000-10.000 palavras

Estrutura DETALHADA:
1. Introdução (1.500 palavras)
   - Hook impactante
   - Apresentação do tema
   - O que será abordado

2. Desenvolvimento (6.000 palavras)
   - 5-7 pontos principais
   - Exemplos reais e cases
   - Histórias e analogias
   - Dados e estatísticas
   - Dicas práticas

3. Conclusão (1.500 palavras)
   - Resumo dos pontos-chave
   - Lições aprendidas
   - Call-to-action
   - Próximos passos

Tom: [seu tom desejado]
Público: [seu público-alvo]

IMPORTANTE: Seja MUITO detalhado, use exemplos práticos e não economize em explicações.
```

### Durante a Geração

- ✅ **Seja paciente**: 15-25 minutos é normal para 5 idiomas
- ✅ **Acompanhe o progresso**: Veja qual parte está sendo gerada
- ✅ **Não feche a página**: Os roteiros aparecem conforme ficam prontos
- ✅ **Mantenha a aba ativa**: Evite minimizar ou trocar de aba

## ❓ Solução de Problemas

### Erro "Invalid API Key"
- Verifique se copiou a chave completa
- Confirme que a API está ativa no Google AI Studio
- Tente gerar uma nova chave

### Roteiros ainda estão curtos
- Use palavras como "EXTENSO", "DETALHADO", "COMPLETO" no prompt
- Especifique quantidade de palavras (ex: "8.000-10.000 palavras")
- Peça exemplos, histórias e casos práticos
- O sistema já está configurado para roteiros longos!

### Demora muito para gerar
- **ISSO É NORMAL para roteiros longos!**
- Sistema de 2 etapas leva 3-5 minutos por idioma
- Total de 15-25 minutos para 5 idiomas completos
- Cada roteiro tem 8.000-10.000 palavras!
- Não feche a página, acompanhe o progresso

### Erro durante a geração
- Verifique sua conexão com internet
- A API do Google pode ter limites de uso
- Tente aguardar alguns minutos e gerar novamente
- Se persistir, verifique o console do navegador (F12)

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
