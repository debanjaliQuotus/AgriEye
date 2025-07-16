import { IUser } from '../models/User';
import { Document } from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            user?: IUser & Document;
            files?: { [fieldname: string]: Express.Multer.File[] };
        }
    }
}

export {};