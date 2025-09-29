import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { OpenAI } from "openai";
import { v4 as uuidv4 } from "uuid";
import cors from "cors";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// ------------------------------
// Configurações
// ------------------------------
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY_TEST });

// ------------------------------
// ROTAS CRUD FAQ
// ------------------------------


// listar meus arquivos do vector
app.get("/vector", async (req, res) => {
  try {
    const response = await openai.vectorStores.files.list(
      "vs_68b075afc84081918e5516914f20b866"
    );
    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar arquivos da vector store" });
  }
});

// buscar arquivo especifico
// Rota para baixar o conteúdo de um arquivo da vector store
app.get("/vector-files/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;

    // 1️⃣ Recupera informações do arquivo
    const file = await openai.files.retrieve(fileId);

    // 2️⃣ Recupera o conteúdo do arquivo
    const contentBuffer = await openai.files.content(fileId);
    const contentString = contentBuffer.toString();

    // 3️⃣ Tenta transformar em JSON, se possível
    let parsedContent;
    try {
      parsedContent = JSON.parse(contentString);
    } catch {
      parsedContent = contentString; // se não for JSON, devolve texto puro
    }

    res.json({
      file,
      content: parsedContent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar conteúdo do arquivo" });
  }
});




// Listar todas as FAQs
app.get("/faq", async (req, res) => {
  const { data, error } = await supabase.from("faq").select("*");
  if (error) return res.status(500).json({ error });
  res.json(data); // retorna pergunta, resposta e embedding
});

// Adicionar nova FAQ
app.post("/faq", async (req, res) => {
  try {
    const { pergunta, resposta } = req.body;
    if (!pergunta || !resposta)
      return res.status(400).json({ error: "Pergunta e resposta obrigatórias" });

    // Gera embedding da pergunta + resposta
    const embeddingResp = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: `${pergunta}\n${resposta}`,
    });
    const embedding = embeddingResp.data[0].embedding;

    // Insere no Supabase
    const { data, error } = await supabase
      .from("faq")
      .insert([{ id: uuidv4(), pergunta, resposta, embedding }])
      .select();

    if (error) return res.status(500).json({ error });
    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao adicionar FAQ" });
  }
});

// Editar FAQ existente
app.put("/faq/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { pergunta, resposta } = req.body;

    // Gera novo embedding
    const embeddingResp = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: `${pergunta}\n${resposta}`,
    });
    const embedding = embeddingResp.data[0].embedding;

    // Atualiza no Supabase
    const { data, error } = await supabase
      .from("faq")
      .update({ pergunta, resposta, embedding })
      .eq("id", id)
      .select();

    if (error) return res.status(500).json({ error });
    res.json(data[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao editar FAQ" });
  }
});

// Excluir FAQ
app.delete("/faq/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from("faq").delete().eq("id", id);
    if (error) return res.status(500).json({ error });
    res.json({ message: "FAQ deletada", data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao deletar FAQ" });
  }
});

// ------------------------------
// Inicia servidor
// ------------------------------
app.listen(3000, () => console.log("Server rodando na porta 3000"));
