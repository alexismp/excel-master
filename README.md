# ExcelMaster AI

An interactive Excel learning application designed to help users master essential formulas, with a special focus on **XLOOKUP**. The app features a live spreadsheet simulator and a real-time admin dashboard for monitoring user progress.

## 🚀 Features

- **Interactive Spreadsheet**: A custom-built grid supporting formulas like `XLOOKUP`, `SUM`, `AVERAGE`, `IF`, `COUNTIF`, and more.
- **XLOOKUP Visualizer**: Real-time visual representation of data retrieval logic.
- **Real-time Admin Dashboard**: 
    - Monitor active sessions live via **Server-Sent Events (SSE)**.
    - Generate unique 3-character access IDs.
    - Track progress, time spent per exercise, and log incorrect formula attempts.
    - **Activity Monitoring**: View first and last activity timestamps for every participant.
    - **Session Management**: Delete sessions directly from the dashboard to reset progress or clear data.
- **Syntax Highlighting**: Color-coded formula parameters to assist learning.
- **Secure Backend**: All data writes are handled by a Node.js backend, ensuring secure Firestore interactions.

## 🏗️ Architecture

The application uses a hybrid architecture designed for performance and security:
- **Frontend**: React (TypeScript) SPA served as static assets.
- **Backend**: Node.js/Express server running on Cloud Run.
- **Database**: Google Cloud Firestore.
- **Real-time**: The backend listens to Firestore changes and streams updates to the Admin Dashboard using Server-Sent Events (SSE), removing the need for client-side Firebase configuration.

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

3. **Google Cloud Auth**:
   Ensure you have a Google Cloud project with Firestore enabled and your local environment is authenticated:
   ```bash
   gcloud auth application-default login
   ```

4. **Run the app**:
   ```bash
   npm run build
   node server.js
   ```

## 🚢 Deployment

The app is deployed to **Google Cloud Run** using a custom Dockerfile.

```bash
# Build and Push
gcloud builds submit --tag gcr.io/[PROJECT_ID]/excel-master .

# Deploy
gcloud run deploy excel-master --image gcr.io/[PROJECT_ID]/excel-master
```

## 📊 Admin Usage

1. Navigate to `/admin` to access the live dashboard.
2. Click **Generate ID** to create a 3-character identifier (e.g., `B3X`).
3. Copy the ID or the full URL and share it with the participant.
4. Watch their progress update instantly as they work through the exercises.
