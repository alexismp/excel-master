import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Firestore, FieldValue } from '@google-cloud/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;

// Initialize Firestore
// It will automatically use the project ID from the Cloud Run environment
const db = new Firestore();
const COLLECTION_NAME = 'sessions';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// SSE Clients
let clients = [];

// Listen to Firestore changes and broadcast to clients
db.collection(COLLECTION_NAME).onSnapshot(snapshot => {
    const sessions = {};
    snapshot.forEach(doc => {
        sessions[doc.id] = doc.data();
    });
    
    const data = `data: ${JSON.stringify(sessions)}\n\n`;
    clients.forEach(client => client.res.write(data));
});

// SSE Endpoint for Admin Page
app.get('/api/admin/updates', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = { id: clientId, res };
    clients.push(newClient);

    req.on('close', () => {
        clients = clients.filter(client => client.id !== clientId);
    });
});

// Tracking API
app.post('/api/track/visit', async (req, res) => {
    try {
        const { userId, lessonId } = req.body;
        console.log(`[Visit] User: ${userId}, Lesson: ${lessonId}`);
        const sessionRef = db.collection(COLLECTION_NAME).doc(userId);
        
        const progressData = {
            userId,
            lessonId,
            status: 'pending',
            startTime: Date.now(),
            incorrectFormulas: []
        };

        await sessionRef.set({
            userId,
            progress: {
                [lessonId]: progressData
            }
        }, { merge: true });
        console.log(`[Visit] Success for ${userId}`);

        res.status(200).send({ success: true });
    } catch (error) {
        console.error('[Visit Error]:', error);
        res.status(500).send(error.message);
    }
});

app.post('/api/track/incorrect', async (req, res) => {
    try {
        const { userId, lessonId, formula } = req.body;
        console.log(`[Incorrect] User: ${userId}, Lesson: ${lessonId}, Formula: ${formula}`);
        const sessionRef = db.collection(COLLECTION_NAME).doc(userId);
        
        await sessionRef.update({
            [`progress.${lessonId}.incorrectFormulas`]: FieldValue.arrayUnion(formula)
        });
        console.log(`[Incorrect] Success for ${userId}`);

        res.status(200).send({ success: true });
    } catch (error) {
        console.error('[Incorrect Error]:', error);
        res.status(500).send(error.message);
    }
});

app.post('/api/track/success', async (req, res) => {
    try {
        const { userId, lessonId } = req.body;
        console.log(`[Success] User: ${userId}, Lesson: ${lessonId}`);
        const sessionRef = db.collection(COLLECTION_NAME).doc(userId);
        
        await sessionRef.update({
            [`progress.${lessonId}.status`]: 'success',
            [`progress.${lessonId}.endTime`]: Date.now()
        });
        console.log(`[Success] recorded for ${userId}`);

        res.status(200).send({ success: true });
    } catch (error) {
        console.error('[Success Error]:', error);
        res.status(500).send(error.message);
    }
});

// Fallback to index.html for client-side routing
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
