# Istanbul Historical Guide — Local RAG Chatbot

A fully offline AI chatbot that answers questions about Istanbul's historical places using Retrieval-Augmented Generation (RAG) and Microsoft Foundry Local.

Built as part of the **Microsoft Azure AI Summer Program 2026**.

<img width="2630" height="1542" alt="Ekran görüntüsü 2026-07-10 142406" src="https://github.com/user-attachments/assets/75cc21cb-1f37-4171-bd58-557b14e1bf6d" />


## What It Does

Ask questions about Istanbul's most iconic historical places:
- 🕌 Hagia Sophia
- 👑 Topkapi Palace  
- 🗼 Galata Tower
- 🛍️ Grand Bazaar
- 🌊 Maiden's Tower
- 🏰 Rumeli Hisarı
- ✨ Çırağan Palace

The chatbot retrieves relevant information from local PDF documents and generates answers using an on-device AI model. No internet connection required after setup.

## Key Features

- **100% Offline** — runs entirely on your device, no API keys needed
- **PDF & Word Support** — reads .pdf and .docx files in addition to markdown
- **Recursive folder scanning** — automatically indexes all files in subfolders
- **Background slideshow** — photos of each historical place appear as you ask about them
- **Built on Foundry Local** — uses Microsoft's on-device AI runtime with Phi-3.5 Mini

## What I Added to the Original Project

This project is based on [leestott/local-rag](https://github.com/leestott/local-rag) by Lee Stott. I extended it with:

1. **PDF and Word (.docx) document support** using `pdfjs-dist` and `mammoth`
2. **Recursive subfolder scanning** — the original only read from the root `docs/` folder
3. **Istanbul Historical Places theme** — custom UI with background photo slideshow
4. **Dynamic backgrounds** — background changes based on which place you ask about
5. **Improved system prompt** — tuned for historical Q&A

## How to Run

### Prerequisites
- Node.js 20+
- Microsoft Foundry Local: `winget install Microsoft.FoundryLocal`

### Setup
```bash
git clone https://github.com/eypulla/microsoft-azure-local-rag-istanbul-history.git
cd microsoft-azure-local-rag-istanbul-history
npm install
npm run ingest
npm start
```

Open `http://127.0.0.1:3000` in your browser.

The AI model (Phi-3.5 Mini, ~4GB) will download automatically on first run.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AI Model | Foundry Local + Phi-3.5 Mini |
| Backend | Node.js + Express |
| Vector Store | SQLite (better-sqlite3) |
| Retrieval | TF-IDF + cosine similarity |
| PDF Reading | pdfjs-dist |
| Word Reading | mammoth |
| Frontend | HTML/CSS/JavaScript |

## My Journey

When I started this project, I had no idea what RAG was. Over the course of the program, I learned about it through the provided Microsoft resources and my own research — gradually understanding how retrieval, embeddings, vector stores, and language models work together.

At one point, I thought: *"Could I use this for my own course notes?"* I tried adding my lecture PDFs and Word documents, but quickly realized most of my notes were handwritten or contained screenshots — which text-based RAG can't read. So I extended the original codebase to support PDF and .docx files, which was a real engineering challenge since the original project only handled markdown files.

After that, I wanted a topic that would actually work well with text-based documents. I chose Istanbul's historical places — rich in history, full of stories, and something I find genuinely interesting. The result is this chatbot, which can tell you about Hagia Sophia, Galata Tower, Topkapi Palace, and more — all running completely offline on your own machine.

This project taught me that the best way to learn something is to try to build it, hit real problems, and figure out how to solve them.

## Program

This project was built by Nehir Eylül Balcı as part of the **Microsoft Azure AI Summer Program 2026** organized by Barbaros Günay, CSA Manager at Microsoft Turkey.

Original project: [leestott/local-rag](https://github.com/leestott/local-rag)

