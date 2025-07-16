import mongoose, { Document, Schema } from 'mongoose';

export interface IMotionEvent extends Document {
  timestamp: Date;
  photo: Buffer;
  detectedObjects: [
    {
      label: String,
      confidence: Number,
      boundingBox: [[Number]] // or [Number][], based on actual shape
    }
  ];
  createdAt?: Date;
  updatedAt?: Date;
}

const motionEventSchema: Schema = new Schema(
  {
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    photo: {
      type: Buffer,
      required: true,
    },
    detectedObjects: [
      {
        label: { type: String, required: true },
        confidence: { type: Number, required: true },
        boundingBox: {
          type: [[Number]], // 2D array for bounding box coordinates
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);


const MotionEvent = mongoose.model<IMotionEvent>('MotionEvent', motionEventSchema);

export default MotionEvent;
