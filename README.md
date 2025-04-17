# TextTones

TextTones is a modern text-to-speech converter built with React and AWS Polly, offering high-quality voice synthesis in multiple languages.

## Features

- 40+ voices across 20+ languages
- Neural text-to-speech technology
- Real-time voice preview
- Download audio in MP3 format
- User history tracking
- Responsive design
- Cross-browser compatibility

## Tech Stack

- React + Vite
- Tailwind CSS
- AWS Polly
- Firebase Authentication
- Firestore Database

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_AWS_REGION=your-region
VITE_AWS_ACCESS_KEY=your-access-key
VITE_AWS_SECRET_KEY=your-secret-key

VITE_API_KEY=firebase-api-key
VITE_AUTH_DOMAIN=firebase-auth-domain
VITE_PROJECT_ID=firebase-project-id
VITE_STORAGE_BUCKET=firebase-storage-bucket
VITE_MESSAGING_SENDER_ID=firebase-sender-id
VITE_APP_ID=firebase-app-id
VITE_MEASUREMENT_ID=firebase-measurement-id
```

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/TextTones.git

# Navigate to project directory
cd TextTones

# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage

1. Select your preferred language
2. Choose a voice
3. Enter or paste your text
4. Click "Convert to Speech"
5. Preview the audio
6. Download if desired

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgments

- AWS Polly for text-to-speech conversion
- Firebase for authentication and database
- Media Chrome for the audio player
- Tailwind CSS for styling
