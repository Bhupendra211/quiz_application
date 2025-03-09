import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import adminQuiz from './routes/admin/quiz.route.js';
import dbConnect from './utils/dbConnection.js';
import authRoutes from './routes/auth.route.js';
import { authenticateUser, authorizeRoles } from './middleware/auth.middleware.js';
import competitionRoutesManager from './routes/user/competition.route.js';
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
dbConnect();

app.get('/v1/', (req, res) => {
    res.send("Hello world");
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', authenticateUser, authorizeRoles('admin'), adminQuiz);
app.use('/api/v1/competition', authenticateUser, authorizeRoles('student'), competitionRoutesManager);


export default app;