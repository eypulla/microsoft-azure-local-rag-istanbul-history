/**
 * Ingestion script.
 * Reads all markdown documents from the docs/ folder,
 * chunks them, and stores in the local SQLite vector store.
 *
 * Usage: node src/ingest.js
 */
import fs from "fs";  // file system demek dosya okumak yazmak klasöre bakmak için kullanılıyor 
import path from "path";
import { config } from "./config.js";
import { parseFrontMatter, chunkText } from "./chunker.js";
import { VectorStore } from "./vectorStore.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import mammoth from "mammoth";



function isSupported(filename) { 
  return filename.endsWith(".md") || filename.endsWith(".pdf") || filename.endsWith(".docx");
}


function getAllFiles(dirPath) {
    // sonuçları tutacak dizi
    let results = [];
    
    // klasördeki her şeye bak
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath); // dosya mı klasör mü?
        
        if (stat.isDirectory()) {
            results = results.concat(getAllFiles(fullPath));

        } else if (isSupported(item)) {
            results = results.concat(fullPath);
        }
    }
    
    return results;
}


function readMarkdown(filePath){
  const raw =fs.readFileSync(filePath, "utf-8");
  return parseFrontMatter(raw);

}

async function readPdf(filePath) {
  const data = new Uint8Array(fs.readFileSync(filePath));
  const doc = await pdfjsLib.getDocument({ data }).promise;
  let text = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => item.str).join(" ") + "\n";
  }
  text = text.replace(/\x00/g, '').replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').trim();
  return { meta: {}, body: text };
}


async function readDocx(filePath){
  const result = await mammoth.extractRawText({ path: filePath });
  return {
    meta :{}, body: result.value}

}


async function ingest() {
  console.log("=== Gas Field RAG – Document Ingestion ===\n");

  const docsDir = config.docsDir;
  if (!fs.existsSync(docsDir)) {
    console.error(`Docs directory not found: ${docsDir}`);
    process.exit(1);
  }

  const files = getAllFiles(docsDir).sort();

  if (files.length === 0) {
    console.error("No markdown files found in docs/");
    process.exit(1);
  }

  console.log(`Found ${files.length} documents.\n`);

  const store = new VectorStore(config.dbPath);
  store.clear(); // Fresh ingestion each time

  let totalChunks = 0;

  for (const file of files) {
     let meta , body;

    if (file.endsWith (".pdf")){
      ({ meta, body } = await readPdf(file));
    }

    else if (file.endsWith (".docx")){
      ({ meta, body } = await readDocx(file));
    } 

    else { ({ meta, body } = readMarkdown( file));}


    body = `File path: ${file}\nCourse: ${path.basename(path.dirname(file))} | Document: ${path.basename(file)}\n\n` + body;

    const docId = meta.id || path.basename(file, ".md");
    const title = meta.title || file;
    const category = (meta.category && meta.category.trim()) || path.basename(path.dirname(file));
    const chunks = chunkText(body, config.chunkSize, config.chunkOverlap);

    for (let i = 0; i < chunks.length; i++) {
      store.insert(docId, title, category, i, chunks[i]);
    }

    console.log(`  ✓ ${file} → ${chunks.length} chunk(s)  [${category}]`);
    totalChunks += chunks.length;
  }

  console.log(`\nIngestion complete: ${totalChunks} chunks from ${files.length} documents.`);
  console.log(`Database: ${config.dbPath}`);
  store.close();
}

ingest().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
