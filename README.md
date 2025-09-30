# Project Name: The AI-Powered Note Companion

## Table of Contents

* [About the Project](#about-the-project)
* [Key Features](#key-features)
* [Technology Stack](#technology-stack)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Configuration](#configuration)
    * [Installation](#installation)
* [Usage](#usage)
* [Screenshots](#screenshots)

---

## About the Project

The AI-Powered Note Companion is a sophisticated, full-stack note-taking application designed for modern knowledge workers and students. It uses a robust **MERN stack** for core functionality while integrating a dedicated **Python/FastAPI microservice** to leverage cutting-edge AI for content enhancement.

The primary goal is to transform passive notes into active, actionable study tools through automated summarization and flashcard generation, significantly boosting efficiency and learning retention.

## Key Features

* **Full CRUD & Organization:** Seamless management of notes and folders with categorized organization ("Studies," "To-Do," "Journal," "Other").
* **Real-time Search:** Instantly filter notes by title within the current folder.
* **AI Summarization:** Utilizes the **T5-large** transformer model (hosted via FastAPI) to condense lengthy text passages into concise summaries.
* **AI Flashcard Generation:** Leverages **Google Gemini 2.5 Flash** for sophisticated prompt engineering to convert notes into structured question-and-answer pairs for self-testing.
* **To-Do Functionality:** Dedicated checklist note format for task management.
* **Responsive UI:** Supports an optimal viewing experience across desktop and mobile browsers, including a **Dark Mode** option.

## Technology Stack

The application uses a microservice architecture to isolate the demanding AI tasks from the main API.

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | `React.js` + `Vite`| Client-side UI, state management, and user interaction. |
| **Core Backend** | `Node.js`, `Express.js` | RESTful API for authentication, data persistence, and routing AI requests. |
| **Database** | `MongoDB` (via Mongoose) | Flexible, scalable data storage for all user-generated content. |
| **AI Server** | `FastAPI`, `Python` | High-performance Python microservice hosting the large language models. |
| **AI Models** | `Gemini 2.5 Flash`, `T5-large` | Handles complex natural language generation and summarization tasks. |

## Getting Started

### Prerequisites

To run this project, you will need:

* **Node.js** and **npm** (for Frontend & Express Backend)
* **Python 3.9+** and **pip** (for FastAPI AI Service)
* **MongoDB Instance** (Local or Atlas)
* **GEMINI_API_KEY** (for the FastAPI service)

### Configuration

Each service requires specific environment variables to function correctly and communicate with the others.

* **Express Backend:**
   * MONGODB_URI= `your-mongodb-uri`
   * JWT_SECRET=`your-jwt-secret`
   * ENCRYPTION_KEY=`your-encryption-key`
* **FastAPI AI Service:** Must set the `GEMINI_API_KEY`.

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/aditirao29/Notes_website.git
   cd Notes_website
   ```
2. Setup Frontend (React + Vite):

   ```
   cd frontend
   npm install
   npm run dev
   ```
3. Setup Backend (Node.js + Express):

   ```
   cd backend
   npm install
   npm start
   ```

4. Setup AI service (FastAPI + Python):
   
    ```
    cd ML
    pip install -r requirements.txt
    ```

5. Run the FastAPI server with Uvicorn:

   ```
   uvicorn summarizer:app --reload
   ```

   The ML API will run at `http://localhost:8000`.
   This service handles:
      * Summarization using T5-large
      * Flashcard Generation using Gemini 2.5 Flash

   *Note:* The T5-large model will be automatically downloaded by the transformers library the first time the AI service runs, so no manual download is required.

6. Access the application:

   Once all services are running:
      * Frontend → http://localhost:5173
      * Backend → http://localhost:8080
      * AI Service → http://localhost:8000

---

## Usage

1.  **Access:** Navigate to the deployed or local frontend application (`http://localhost:5173`).
2.  **Organize:** Create folders and notes categorized as Studies, To-Do, or Journal.
3.  **Generate Summary:** Open a study note and click the **"Generate Summary"** button to condense the main content.
4.  **Create Flashcards:** Click the **"Generate Flashcards"** button to instantly transform your note's key concepts into review cards powered by Gemini.
5.  **Review:** Use the interactive flashcard viewer to test your knowledge.

---

### Screenshots
<img width="500" height="400" alt="image" src="https://github.com/user-attachments/assets/ab41762d-89ad-4a8b-8d4d-111c09633ed1" />
<img width="500" height="400" alt="Screenshot 2025-09-30 184607" src="https://github.com/user-attachments/assets/54b9211b-ea75-464a-bd8c-80985197d09b" />
<img width="500" height="400" alt="Screenshot 2025-09-30 184713" src="https://github.com/user-attachments/assets/d29703f2-f609-468b-9cbb-27204341edf9" />
<img width="500" height="400" alt="Screenshot 2025-09-30 185030" src="https://github.com/user-attachments/assets/27a4653a-041f-41d5-b5ed-8448cd1a072c" />

