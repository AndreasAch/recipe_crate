import express from 'express';
import cors from 'cors';
import recipeRoutes from '../server/src/routes/recipeRoutes'; 

const app = express();
app.use(cors());
app.use(express.json());

// Debug for vercel deployment
app.get('/api', (req, res) => {
    res.json({ message: 'API is alive!' });
});

// Add the recipeRoutes to the app
app.use('/api/recipes', recipeRoutes);


export default app;