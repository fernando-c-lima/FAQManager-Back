# 📚 FAQ Manager Back

API em **Node.js + Express** para gerenciamento de FAQs, utilizando **Supabase** como banco de dados, **OpenAI** para embeddings e integração com **vector stores**.

---

## 🚀 Tecnologias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Supabase](https://supabase.com/)
- [OpenAI API](https://platform.openai.com/)
- [CORS](https://www.npmjs.com/package/cors)
- [Dotenv](https://www.npmjs.com/package/dotenv)
- [Nodemon](https://nodemon.io/) (dev)

---

## 📂 Estrutura do Projeto

faqmanager-back/
├── server.js 
├── package.json 
└──  .env

---

## ⚙️ Configuração

Crie um arquivo **`.env`** na raiz do projeto e adicione:

```env
SUPABASE_URL=https://SEU-PROJETO.supabase.co
SUPABASE_KEY=chave_api_supabase
OPENAI_API_KEY_TEST=sua_chave_openai
```

# Clonar repositório
```env
git clone https://github.com/seu-usuario/faqmanager-back.git
```

# Acessar pasta
```env
cd faqmanager-back
```
```env
# Instalar dependências
npm install
```
# Executar
```env
node --watch server.js
```
