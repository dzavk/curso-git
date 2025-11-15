# 💝 GUIA PARA USAR O TRADUTOR GEMINI

## 📦 O QUE VOCÊ PRECISA

### 1️⃣ Instalar Python (SÓ UMA VEZ)

1. **Baixe o Python**:
   - Vá em: https://www.python.org/downloads/
   - Clique no botão amarelo grande "Download Python"

2. **Instale**:
   - Abra o arquivo baixado
   - **IMPORTANTE**: Marque a caixinha **"Add Python to PATH"** ✅
   - Clique em "Install Now"
   - Aguarde instalar
   - **REINICIE O COMPUTADOR**

### 2️⃣ Pegar a API Key do Gemini (SÓ UMA VEZ)

1. Entre em: https://aistudio.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em "Create API Key"
4. **Copie a chave** e guarde (você vai precisar)

### 3️⃣ Instalar as Bibliotecas (SÓ UMA VEZ)

1. Aperte `Windows + R`
2. Digite `cmd` e aperte Enter
3. Na janela preta, digite:
```
cd Desktop\tradutor_gemini
pip install flask google-generativeai python-docx
```
4. Aguarde instalar (2-3 minutos)

---

## 🚀 COMO USAR (TODA VEZ)

### Opção 1: Clique Duplo (MAIS FÁCIL!)

1. Vá na pasta `tradutor_gemini`
2. **Clique 2 vezes** no arquivo `INICIAR_TRADUTOR.bat`
3. Uma janela preta vai abrir
4. Aguarde aparecer: "Servidor iniciando..."
5. Abra seu navegador (Chrome, Edge, etc.)
6. Digite: `localhost:5000`
7. **Pronto! O tradutor está aberto!** 🎉

### Opção 2: Pelo Terminal

1. Aperte `Windows + R`
2. Digite `cmd` e aperte Enter
3. Digite:
```
cd Desktop\tradutor_gemini
python tradutor.py
```
4. Abra o navegador em `localhost:5000`

---

## 📝 COMO TRADUZIR

### Para 1 roteiro:

1. **Cole sua API Key** (só precisa colar uma vez, fica salva)
2. **Digite o número** do roteiro (ex: 01, 02, video_01)
3. **Selecione os idiomas** que você quer
4. **Cole o texto** ou arraste um arquivo TXT
5. Clique em **"Traduzir Agora"**
6. Aguarde e baixe!

### Para VÁRIOS roteiros de uma vez:

1. **Cole sua API Key**
2. **NÃO coloque número** (ou coloque um prefixo geral)
3. **Selecione os idiomas**
4. **Arraste 10, 20, 50 arquivos TXT** de uma vez na área de upload
5. Clique em **"Traduzir Agora"**
6. Aguarde (pode demorar se forem muitos)
7. Baixe individual ou tudo junto em ZIP!

---

## 📥 TIPOS DE DOWNLOAD

- **TXT**: Arquivo de texto simples
- **DOCX**: Documento Word formatado
- **SRT**: Legendas divididas em 400 caracteres (para CapCut)

Você pode baixar:
- **1 idioma** de 1 roteiro
- **Todos os idiomas** de 1 roteiro (ZIP)
- **TUDO** de todos os roteiros (ZIP)

---

## 🛑 PARA FECHAR O PROGRAMA

- Feche a janela preta (terminal)
- Ou aperte `Ctrl + C` na janela preta

---

## ❓ PROBLEMAS?

### "Não abre localhost:5000"
- Certifique-se que a janela preta está aberta
- Ela precisa mostrar "Servidor iniciando..."

### "Erro na API Key"
- Verifique se copiou a chave completa
- Pegue uma nova em: https://aistudio.google.com/app/apikey

### "python não é reconhecido"
- Você precisa instalar o Python
- Na instalação, marque "Add Python to PATH"
- Reinicie o computador

---

## 💡 DICAS

- A API Key fica salva no navegador, não precisa digitar toda vez
- Para textos grandes, pode demorar 5-10 minutos
- Quanto mais idiomas, mais demora
- Você pode usar enquanto traduz (fica na aba do navegador)

---

## 📞 PRECISA DE AJUDA?

Me chama! 💕

---

**Feito com ❤️ para facilitar sua vida!**
