# DermaScan

AI-powered skin analysis app. Upload a selfie, get a personalized skin assessment and care routine delivered to your inbox.

## Live Demo

- **App:** [https://derma-scan.vercel.app](https://derma-scan.vercel.app)
- **API:** [https://dermascan-cry3.onrender.com](https://dermascan-cry3.onrender.com)

## What It Does

1. **Survey** — user answers 7 questions about their skin, lifestyle, and concerns
2. **Photo Upload** — user uploads a makeup-free selfie
3. **AI Analysis** — Gemini Vision API analyzes the photo alongside survey answers and returns a full skin assessment
4. **Results Page** — instant skin scores across 8 metrics (hydration, texture, pores, dark spots, fine lines, oil production, sensitivity, pigmentation)
5. **Email Report** — user subscribes to receive a detailed routine plan, ingredient guide, and lifestyle tips via EmailJS

## Tech Stack

**Frontend**
- HTML, CSS, JavaScript (vanilla)
- EmailJS for email delivery
- Deployed on Vercel

**Backend**
- Node.js + Express
- Gemini Vision API (gemini-2.5-flash) for skin analysis
- MongoDB Atlas + Mongoose for product database
- Formidable for image upload handling
- Deployed on Render
