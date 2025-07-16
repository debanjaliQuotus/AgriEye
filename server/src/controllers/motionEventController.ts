import { Request, Response } from "express";
import path from "path";
import MotionEvent from "../models/MotionEvent";
import { ImageAnnotatorClient } from "@google-cloud/vision";

const keyPath = path.resolve(
    __dirname,
    "../visionapi/crucial-raceway-459108-k2-efcf8535a54d.json"
);

export const createMotionEvent = async (req: Request, res: Response): Promise<void> => {
    try {
        const { timestamp } = req.body;

        if (!req.file) {
            res.status(400).json({ message: "Photo file is required" });
            return;
        }

        let parsedTimestamp: Date;
        if (timestamp) {
            parsedTimestamp = new Date(timestamp);
            if (isNaN(parsedTimestamp.getTime())) {
                res.status(400).json({
                    message: "Invalid timestamp format. Use ISO format (e.g., 2025-05-05T10:00:00.000Z)",
                });
                return;
            }
        } else {
            parsedTimestamp = new Date();
        }

        const client = new ImageAnnotatorClient({
            keyFilename: keyPath,
        });

        if (!client.objectLocalization) {
            res.status(500).json({ message: 'Object localization method not available' });
            return;
        }

        const [result] = await client.objectLocalization({
            image: { content: req.file.buffer }
        });

        if (!result.localizedObjectAnnotations) {
            res.status(500).json({ message: 'No object annotations found' });
            return;
        }

        const detectedObjects = result.localizedObjectAnnotations.map((object) => ({
            label: object.name ?? '',
            confidence: object.score ?? 0,
            boundingBox: object.boundingPoly?.normalizedVertices?.map((v) => [
                v.x ?? 0,
                v.y ?? 0,
            ]) ?? [],
        }));

        const newEvent = new MotionEvent({
            timestamp: parsedTimestamp,
            photo: req.file.buffer,
            detectedObjects,
        });

        await newEvent.save();

        res.status(201).json({
            message: "Motion event saved and object detection completed successfully",
            detectedObjects,
        });
    } catch (error) {
        console.error("Error saving motion event:", error);
        res.status(500).json({ 
            message: error instanceof Error ? error.message : "Internal server error" 
        });
    }
};

export const getAllMotionEvents = async (_req: Request, res: Response): Promise<void> => {
    try {
        const events = await MotionEvent.find().sort({ createdAt: -1 });

        const formattedEvents = events.map((event) => ({
            _id: event._id,
            timestamp: event.timestamp.toISOString(),
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
            photo: event.photo,
            detectedObjects: event.detectedObjects,
        }));

        res.json(formattedEvents);
    } catch (error) {
        console.error("Error fetching motion events:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
