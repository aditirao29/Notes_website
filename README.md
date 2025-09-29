# Project Name: The AI-Powered Note Companion

## Table of Contents

* [About the Project](#about-the-project)
* [Key Features](#key-features)
* [Technology Stack](#technology-stack)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Configuration](#configuration)
* [Usage](#usage)

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
| **Frontend** | `React.js` (with Hooks/Context) | Client-side UI, state management, and user interaction. |
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

* **Frontend:** Must set the URL for the Express Backend (e.g., `REACT_APP_API_URL`).
* **Express Backend:** Must set `MONGODB_URI` and the URL for the FastAPI AI Service (e.g., `AI_SERVICE_URL`).
* **FastAPI AI Service:** Must set the `GEMINI_API_KEY`.

## Usage

1.  **Access:** Navigate to the deployed or local frontend application (`http://localhost:3000`).
2.  **Organize:** Create folders and notes categorized as Studies, To-Do, or Journal.
3.  **Generate Summary:** Open a study note and click the **"Generate Summary"** button to condense the main content.
4.  **Create Flashcards:** Click the **"Generate Flashcards"** button to instantly transform your note's key concepts into review cards powered by Gemini.
5.  **Review:** Use the interactive flashcard viewer to test your knowledge.
