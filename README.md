# ChatERP - Enterprise Resource Planning AI Assistant

A modern web application that provides AI-powered assistance for enterprise resource planning tasks. This application mimics the interface shown in the provided images, offering various specialized advisors for different business domains.

## Features

- Multiple specialized AI advisors for different business domains
- Modern and intuitive chat interface
- Real-time messaging with AI assistants
- Model selection capability
- Chat history tracking
- Responsive design

## Tech Stack

- Next.js for the frontend and API routes
- Styled Components for styling
- Axios for API requests

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd ai-erp
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Usage

1. Select an advisor from the home screen
2. Start chatting with the AI assistant
3. Use the sidebar to create new chats or switch between existing conversations
4. Change models using the dropdown in the sidebar

## Project Structure

- `/app` - Next.js App Router structure
  - `/api` - API routes
  - `/chat` - Chat pages
  - `/utils` - Utility functions
- `/components` - React components
- `/public` - Static files
- `/styles` - Global styles

## API Integration

The application integrates with a backend AI service. The API key is stored securely in environment variables and only used in server-side API routes.

## License

This project is for demonstration purposes only.
