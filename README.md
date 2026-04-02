<p align="center">
  <div align="center">
    <div style="font-size: 64px; margin-bottom: 20px;">⭐</div>
    <h1 align="center">Abandon<span style="color: #818cf8;">OldLove</span></h1>
    <p align="center">
      <strong>English</strong> | <a href="./README-ZH.md">简体中文</a>
    </p>
    <p align="center">
      <strong>A zero-backend, beautifully crafted GitHub Star bulk manager.</strong><br/>
      <a href="https://hizzyishome.github.io/AbandonOldLove/">✨ Try Live Demo ✨</a>
    </p>
  </div>
</p>

<p align="center">
  <em>"When we were young and naive, it was inevitable to fall for the wrong person.<br>
  When we were noobs back in the day, browsing GitHub inevitably led us to star some random weird repos.<br>
  It doesn’t matter if you loved the wrong one or starred the wrong stuff.<br>
  Abandon old loves will cure your OCD right away."</em>
</p>

---

## 🌟 Features

* **Zero-Backend Architecture**: Your token stays with you. All GraphQL requests are fired directly from your browser to the Official GitHub API.
* **Fort Knox Security**: Need to keep yourself logged in? We use **Web Crypto API (AES-GCM)** to encrypt your Personal Access Token locally with a custom passkey. No plaintext leaks.
* **Mass Unstar Engine**: A sophisticated async-queue system with concurrency limits and jitter to navigate GitHub's strict rate limits safely. Perform mass unstars seamlessly.
* **Rich Filtering**: Hunt down those ancient, unmaintained repos. Sort active repositories by `Pushed At` or `Updated At`. Filter out repos inactive for > X days and execute mass-unstar.
* **Multi-Language & Theming**: Built-in, zero-dependency localization (English / 中文) and slick Dark/Light mode tracking, paired with a gorgeous UI built on shadcn/ui.

## 🛠 Tech Stack

* **Core**: React 18 / TypeScript / Vite
* **State Management**: Zustand
* **Styling**: Tailwind CSS v3 / shadcn UI / Lucide Icons
* **Data Fetching**: GraphQL Request (`graphql-request`)
* **I18n**: i18next & react-i18next

## 🚀 Quick Start

### 1. Prerequisites
You will need Node.js (v18+) and npm installed. 

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/AbandonOldLove.git
cd AbandonOldLove
npm install
```

### 3. Development Server
Run the local Vite server:

```bash
npm run dev
```
Navigate to `http://localhost:5173`. 
> **Important**: This app heavily relies on the browser's `SubtleCrypto` API for local token encryption. This API is ONLY available on `localhost` or via **HTTPS**.

## 📖 Usage Instructions

### 1. Generate a Classic GitHub PAT
In order to manage your stars, AbandonOldLove requires a Personal Access Token:
1. Go to your [GitHub Token Settings](https://github.com/settings/tokens).
2. Generate a **Classic Token** (Do not use Fine-Grained tokens as they cannot manage global repo stars).
3. Ensure the scopes `repo` or `public_repo` and `read:user` are checked.

### 2. Login & Passkey Encryption
* **First time**: Paste your PAT and uniquely create a local passkey. The App encrypts the PAT via AES-GCM and stores the ciphertext in your browser's localStorage. 
* **Returning**: Just type your passkey to locally decrypt the vault and log in without fetching the token again.

### 3. Dashboard Operations
* **Filter & Sort**: Use the top bar to toggle whether "activity" is determined by Developer Pushing (`Pushed At`) or General Updates (`Updated At`).
* **Single Unstar**: Click standard `Unstar` actions and review the prompt.
* **Batch Execution**: Enter a threshold (e.g., `1000` days). It will automatically isolate all repos that have had no push/update in over 1000 days. Click the **Batch Unstar** warning button to rapidly cleanse your list!

## ⚠️ Known Limitations
- **Fine-Grained Tokens ARE NOT SUPPORTED**. GitHub's current specification for fine-grained permissions prevents cross-organization star management. You will face a "Resource not accessible by personal access token" error if you use them. Stick to Classic PATs! 

## 📝 License
MIT License. Created to cure our GitHub Star OCD.
