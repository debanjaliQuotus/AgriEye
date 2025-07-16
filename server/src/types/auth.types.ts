export interface JwtPayloadUser {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'farmer';
    aadhaarNumber: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayloadUser;
        }
    }
}