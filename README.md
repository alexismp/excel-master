# ExcelMaster AI

An interactive Excel learning application designed to help users master essential formulas, with a special focus on **XLOOKUP**. The app features a live spreadsheet simulator, an AI-powered tutor, and an admin dashboard for progress tracking.

![ExcelMaster AI Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## 🚀 Features

- **Interactive Spreadsheet**: A custom-built grid that supports formulas like `XLOOKUP`, `SUM`, `AVERAGE`, `IF`, `COUNTIF`, and more.
- **XLOOKUP Visualizer**: Real-time visual representation of how XLOOKUP searches and returns data.
- **AI Tutor**: Powered by Gemini, the tutor provides step-by-step explanations and generates custom practice scenarios.
- **Admin Dashboard**: Generate unique 3-character access IDs and track user progress in real-time, including time spent per exercise and incorrect formula attempts.
- **Syntax Highlighting**: Beautifully color-coded formula parameters to help beginners understand function structures.

## 🛠️ Tech Stack

- **Frontend**: React (TypeScript), Vite, Tailwind CSS
- **Icons**: Lucide React
- **AI**: Google Gemini API (`@google/genai`)
- **Deployment**: Google Cloud Run

## 💻 Local Development

1. **Clone the repository**:
   ```bash
   git clone git@github.com:alexismp/excel-master.git
   cd excel-master
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🚢 Deployment

The app is optimized for Google Cloud Run. To deploy:

```bash
gcloud run deploy excel-master --source .
```

## 📊 Admin Usage

1. Navigate to `/admin` to access the dashboard.
2. Click **Generate ID** to create a 3-character identifier.
3. Share the generated URL with the user.
4. Monitor their progress and common mistakes live from the dashboard.
