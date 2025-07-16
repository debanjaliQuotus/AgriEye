// Define user roles as a union type
export type UserRole = 'admin' | 'farmer';

export interface JwtPayloadUser {
  _id: string;
  email: string;
  role: UserRole;
  name: string;
  aadhaarNumber: string;
}