# 🎙️ Gerador de Vozes com Edge TTS

Sistema web em Python para gerar áudios a partir de texto usando o Edge TTS (Microsoft Edge Text-to-Speech) de forma gratuita. Permite processar múltiplos roteiros de uma vez e selecionar vozes por idioma.

## ✨ Funcionalidades

- 🌍 **Suporte a múltiplos idiomas**: Português, Inglês, Espanhol, Francês, Alemão, Italiano, Japonês, Coreano, Chinês, Russo, Árabe, Hindi e muito mais
- 🎭 **Múltiplas vozes**: Centenas de vozes diferentes, filtradas por idioma
- 📝 **Processamento em lote**: Gere até 20+ áudios de uma vez
- ⚡ **Controles avançados**: Ajuste velocidade e volume da narração
- 💾 **Download direto**: Baixe todos os áudios gerados em formato MP3
- 🎨 **Interface moderna**: Interface web responsiva e intuitiva
- 🆓 **Totalmente gratuito**: Usa o serviço Edge TTS da Microsoft

## 📋 Pré-requisitos

- Python 3.8 ou superior
- pip (gerenciador de pacotes Python)

## 🚀 Instalação

### 1. Clone ou baixe o projeto

```bash
cd voice_generator
```

### 2. Crie um ambiente virtual (recomendado)

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

## 🎮 Como Usar

### 1. Inicie o servidor

```bash
python app.py
```

O servidor será iniciado em `http://localhost:5000`

### 2. Acesse a interface web

Abra seu navegador e acesse: `http://localhost:5000`

### 3. Gere seus áudios

1. **Selecione o idioma** desejado no dropdown
2. **Escolha uma voz** da lista (filtrada pelo idioma selecionado)
3. **Ajuste velocidade e volume** (opcional)
4. **Adicione seus roteiros**:
   - Clique em "+ Adicionar Roteiro" para cada novo texto
   - Dê um título para cada roteiro (opcional)
   - Cole ou digite o texto que deseja converter em áudio
5. **Clique em "Gerar Todos os Áudios"**
6. **Aguarde o processamento** (alguns segundos)
7. **Baixe os áudios** gerados

## 📁 Estrutura do Projeto

```
voice_generator/
├── app.py                 # Aplicação Flask principal
├── requirements.txt       # Dependências Python
├── README.md             # Esta documentação
├── .gitignore            # Arquivos ignorados pelo Git
├── templates/
│   └── index.html        # Interface web
├── static/               # Arquivos estáticos (CSS, JS)
└── output/               # Áudios gerados (criado automaticamente)
```

## 🔧 Configurações Avançadas

### Alterar porta do servidor

Edite o arquivo `app.py` na última linha:

```python
app.run(debug=True, host='0.0.0.0', port=5000)  # Altere 5000 para sua porta
```

### Formato de saída

Por padrão, os áudios são gerados em MP3. Para alterar, modifique a extensão no `app.py`:

```python
filename = f"audio_{timestamp}_{idx+1:02d}.wav"  # Para WAV
```

## 🌟 Exemplos de Uso

### Casos de uso comuns:

- 📚 **Audiobooks**: Converta capítulos de livros em áudio
- 🎓 **E-learning**: Crie narrações para cursos online
- 📢 **Podcasts**: Gere introduções e locuções
- 🎬 **Vídeos**: Crie narrações para vídeos do YouTube
- 🗣️ **Acessibilidade**: Converta textos em áudio para deficientes visuais
- 🌐 **Tradução**: Gere áudios em múltiplos idiomas

## ❓ FAQ

### Quantos roteiros posso processar de uma vez?

Não há limite técnico, mas recomendamos processar até 30 roteiros por vez para melhor performance.

### Os áudios gerados têm marca d'água?

Não! O Edge TTS é um serviço gratuito da Microsoft sem marcas d'água.

### Posso usar comercialmente?

Consulte os termos de uso do Microsoft Edge TTS. Geralmente é permitido para uso pessoal e educacional.

### O servidor precisa estar sempre rodando?

Sim, o servidor Flask precisa estar ativo para gerar novos áudios. Mas os áudios já gerados ficam salvos na pasta `output/`.

### Como adiciono mais de 20 roteiros?

Basta clicar em "+ Adicionar Roteiro" quantas vezes quiser. O sistema suporta quantos roteiros forem necessários.

## 🐛 Solução de Problemas

### Erro ao instalar dependências

```bash
# Atualize o pip
pip install --upgrade pip

# Instale novamente
pip install -r requirements.txt
```

### Porta 5000 já em uso

Altere a porta no `app.py` ou finalize o processo que está usando a porta:

**Linux/Mac:**
```bash
lsof -ti:5000 | xargs kill
```

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Vozes não carregam

Verifique sua conexão com a internet. O Edge TTS requer conexão para listar as vozes disponíveis.

## 🤝 Contribuindo

Sugestões e melhorias são bem-vindas! Sinta-se à vontade para:

- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

## 📝 Licença

Este projeto é fornecido "como está" para uso educacional e pessoal.

## 🙏 Agradecimentos

- Microsoft Edge TTS pela API gratuita
- Flask pelo framework web
- Comunidade Python

---

Desenvolvido com ❤️ para facilitar a geração de áudios
