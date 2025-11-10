# 🚀 GUIA SUPER SIMPLES - Como Rodar o Tradutor

## Passo 1: Instalar o Node.js

1. Entre no site: https://nodejs.org/
2. Clique no botão verde grande para baixar
3. Instale o programa (é só clicar em "Avançar" em tudo)
4. Reinicie o computador

## Passo 2: Conseguir sua Chave do Gemini (API Key)

1. Entre no site: https://makersuite.google.com/app/apikey
2. Faça login com sua conta Google
3. Clique em "Create API Key" ou "Criar Chave"
4. Copie a chave que aparecer (é uma sequência de letras e números)
5. **GUARDE essa chave!** Cole num bloco de notas para não perder

## Passo 3: Abrir o Prompt de Comando (Terminal)

### No Windows:
1. Aperte a tecla **Windows** + **R**
2. Digite: `cmd`
3. Aperte **Enter**
4. Uma janela preta vai abrir (é o terminal)

### No Mac:
1. Aperte **Command** + **Espaço**
2. Digite: `terminal`
3. Aperte **Enter**

### No Linux:
1. Aperte **Ctrl** + **Alt** + **T**

## Passo 4: Ir até a pasta do programa

No terminal que abriu, digite esses comandos (um de cada vez, apertando **Enter** depois de cada):

**Se você está no Windows:**
```
cd curso-git
cd tradutor-gemini
```

**Se você está no Mac ou Linux:**
```
cd curso-git
cd tradutor-gemini
```

## Passo 5: Instalar as coisas necessárias

No terminal, digite:
```
npm install
```

**Aguarde!** Isso vai demorar uns 1-2 minutos. Você vai ver um monte de texto passando. É normal!

Quando terminar, a última linha vai mostrar algo tipo: "added 150 packages"

## Passo 6: Ligar o programa

No terminal, digite:
```
npm start
```

Quando você ver a mensagem:
```
🚀 Servidor rodando em http://localhost:3000
```

Significa que está funcionando! 🎉

## Passo 7: Abrir no navegador

1. Abra seu navegador (Chrome, Firefox, Edge, Safari...)
2. Na barra de endereço, digite:
```
localhost:3000
```
3. Aperte **Enter**

Pronto! O site do tradutor vai abrir! 🎊

## Passo 8: Usar o tradutor

1. **Cole sua API Key** do Gemini no primeiro campo
2. **Selecione os idiomas** que você quer traduzir (pode clicar em "Selecionar Todos")
3. **Cole seu texto** ou **arraste um arquivo**
4. Clique no botão **"Traduzir Agora"**
5. Aguarde (pode demorar alguns minutos dependendo do tamanho)
6. **Baixe as traduções!**

## 🛑 Para Parar o Programa

Quando terminar de usar:
1. Vá no terminal (aquela janela preta)
2. Aperte **Ctrl** + **C**
3. Pode fechar a janela

## 🔄 Para Usar Novamente Depois

Não precisa fazer tudo de novo! Só precisa:

1. Abrir o terminal
2. Ir até a pasta:
   ```
   cd curso-git/tradutor-gemini
   ```
3. Rodar:
   ```
   npm start
   ```
4. Abrir o navegador em: `localhost:3000`

## ❓ Problemas Comuns

### "npm não é reconhecido"
- Você precisa instalar o Node.js (Passo 1)
- Depois de instalar, reinicie o computador

### "Erro na API Key"
- Verifique se copiou a chave completa
- Vá em https://makersuite.google.com/app/apikey e gere uma nova

### "Não abre no navegador"
- Certifique-se que o terminal está mostrando "Servidor rodando"
- Tente: `http://localhost:3000` (com http://)

### "Tradução não funciona"
- Verifique sua conexão com a internet
- Certifique-se que colocou a API Key correta

## 💡 Dicas

- **Deixe o terminal aberto** enquanto estiver usando o tradutor
- **Não feche a janela preta** (terminal)
- Sua API Key fica salva no navegador, não precisa digitar sempre
- Para textos muito grandes, pode demorar 5-10 minutos

## 🆘 Precisa de Ajuda?

Se algo não funcionar:
1. Tire um print da tela mostrando o erro
2. Anote exatamente o que você fez
3. Peça ajuda mostrando o erro

---

**Resumo Rápido:**
1. Instala Node.js
2. Pega chave do Gemini
3. Abre terminal
4. `cd curso-git/tradutor-gemini`
5. `npm install` (só na primeira vez)
6. `npm start`
7. Abre navegador em `localhost:3000`
8. Usa o tradutor! 🎉
