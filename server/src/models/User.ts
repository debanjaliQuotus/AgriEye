import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'farmer';
  aadhaarNumber: string;
  phoneNumber?: string;
  address?: string;
  farmSize?: number;
  cropTypes?: string[];
  location?:string;
  isDefaultAdmin?: boolean;
  createdAt?: Date;
  kyc?: {
    status?: 'pending' | 'verified' | 'rejected';
    phoneVerified?: boolean;
    documents?: {
      aadhar?: string;
      pan?: string;
      selfie?: string;
    };
    verifiedAt?: Date;
    remarks?: string;
  };
  isPhoneVerified: boolean;
  phoneVerificationToken: string;
  phoneVerifiedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'farmer'], required: true },
  aadhaarNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{12}$/, 'Aadhaar must be a 12-digit number']
  },
  phoneNumber: String,
  address: String,
  farmSize: Number,
  cropTypes: [String],
  location: {
    latitude: Number,
    longitude: Number
  },
  isDefaultAdmin: { type: Boolean, default: false },
  kyc: {
    status: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending'
    },
    phoneVerified: {
      type: Boolean,
      default: false
    },
    documents: {
      aadhar: String,
      pan: String,
      selfie: String
    },
    verifiedAt: Date,
    remarks: String
  },
  isPhoneVerified: {
    type: Boolean,
    default: false,
    required: true
  },
  phoneVerificationToken: {
    type: String,
    index: true
  },
  phoneVerifiedAt: {
    type: Date
  }
}, { timestamps: true });


export default mongoose.model<IUser>('User', userSchema);
