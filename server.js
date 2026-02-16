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
        
        const now = Date.now();
        const progressData = {
            userId,
            lessonId,
            status: 'pending',
            startTime: now,
            incorrectFormulas: []
        };

        await sessionRef.set({
            userId,
            firstActive: FieldValue.serverTimestamp(), // Only set on create if using set with merge? No, better use set with merge and check existence or just use serverTimestamp
            lastActive: now,
            progress: {
                [lessonId]: progressData
            }
        }, { merge: true });
        
        // Ensure firstActive is only set once
        const doc = await sessionRef.get();
        if (!doc.data().firstActiveDerived) {
            await sessionRef.update({ firstActiveDerived: now });
        }

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
        const now = Date.now();
        const sessionRef = db.collection(COLLECTION_NAME).doc(userId);
        
        await sessionRef.update({
            lastActive: now,
            [`progress.${lessonId}.incorrectFormulas`]: FieldValue.arrayUnion(formula)
        });
        res.status(200).send({ success: true });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.post('/api/track/success', async (req, res) => {
    try {
        const { userId, lessonId } = req.body;
        const now = Date.now();
        const sessionRef = db.collection(COLLECTION_NAME).doc(userId);
        
        await sessionRef.update({
            lastActive: now,
            [`progress.${lessonId}.status`]: 'success',
            [`progress.${lessonId}.endTime`]: now
        });
        res.status(200).send({ success: true });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.delete('/api/admin/sessions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.collection(COLLECTION_NAME).doc(id).delete();
        console.log(`[Delete] Session ${id} removed`);
        res.status(200).send({ success: true });
    } catch (error) {
        console.error('[Delete Error]:', error);
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
