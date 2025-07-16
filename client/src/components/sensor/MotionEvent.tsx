import React, { useEffect, useState, useRef } from "react";
import { createApiClient, ENDPOINTS } from "../../config/api";
import Layout from "../layouts/Layout";
import { notificationService } from "../../services/notificationService";
import { useAuth } from "../../context/AuthContext";
import { parsePhoneNumberFromString } from "libphonenumber-js";

interface DetectedObjectType {
  label: string;
  confidence: number;
  boundingBox: number[];
}

interface MotionEventType {
  _id: string;
  timestamp: string;
  photo: string;
  detectedObjects: DetectedObjectType[];
  notificationSent?: boolean;
}

const arrayBufferToBase64 = (buffer: number[] | Uint8Array): string => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const formatPhoneNumber = (raw: string): string | null => {
  const phoneNumber = parsePhoneNumberFromString(raw, "IN");
  return phoneNumber?.isValid() ? phoneNumber.format("E.164") : null;
};

const MotionEvent: React.FC = () => {
  const [events, setEvents] = useState<MotionEventType[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<MotionEventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("all");
  const { user } = useAuth();
  const latestEventIdRef = useRef<string | null>(null);

  const rawPhoneNumber =
    localStorage.getItem("userPhoneNumber") || user?.phoneNumber || "";
  const formattedPhoneNumber = formatPhoneNumber(rawPhoneNumber);

  const fetchEvents = async () => {
    try {
      const client = createApiClient();
      const res = await client.get(ENDPOINTS.GET_MOTION_EVENTS);

      const processedEvents: MotionEventType[] = res.data.map((event: any) => ({
        _id: event._id,
        timestamp: event.timestamp,
        photo: `data:image/jpeg;base64,${arrayBufferToBase64(
          event.photo.data
        )}`,
        detectedObjects: event.detectedObjects || [],
        notificationSent: false,
      }));

      const sorted = [...processedEvents].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setEvents(sorted);
      applySorting(sortOption, sorted);

      const newestEvent = sorted[0];
      if (
        newestEvent &&
        newestEvent._id !== latestEventIdRef.current &&
        formattedPhoneNumber
      ) {
        await notificationService.sendMotionDetectionNotification(
          formattedPhoneNumber,
          newestEvent.detectedObjects,
          newestEvent.timestamp
        );
        latestEventIdRef.current = newestEvent._id;

        setEvents((prevEvents) =>
          prevEvents.map((e) =>
            e._id === newestEvent._id ? { ...e, notificationSent: true } : e
          )
        );
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, []);

  const applySorting = (sortType: string, eventList: MotionEventType[]) => {
    const sorted = [...eventList];
    if (sortType === "date") {
      sorted.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } else if (sortType === "time") {
      sorted.sort((a, b) => {
        const timeA =
          new Date(a.timestamp).getHours() * 60 +
          new Date(a.timestamp).getMinutes();
        const timeB =
          new Date(b.timestamp).getHours() * 60 +
          new Date(b.timestamp).getMinutes();
        return timeB - timeA;
      });
    }
    setFilteredEvents(sorted);
  };

  useEffect(() => {
    applySorting(sortOption, events);
  }, [sortOption, events]);

  const sendNotificationManually = async (event: MotionEventType) => {
    if (!formattedPhoneNumber) {
      alert("Phone number is not valid or available.");
      return;
    }
    try {
      await notificationService.sendMotionDetectionNotification(
        formattedPhoneNumber,
        event.detectedObjects,
        event.timestamp
      );
      const updated = events.map((e) =>
        e._id === event._id ? { ...e, notificationSent: true } : e
      );
      setEvents(updated);
      alert("Notification sent successfully.");
    } catch (err) {
      console.error("Notification error:", err);
      alert("Failed to send notification.");
    }
  };

  return (
    <Layout>
      {loading ? (
        <p className="text-center text-gray-500">Loading events...</p>
      ) : (
        <div className="flex flex-col items-end w-full">
          <h2 className="text-2xl font-bold mb-4">Motion Events</h2>

          <div className="mb-4 text-sm">
            {formattedPhoneNumber ? (
              <p className="text-green-600">
                Notifications will be sent to: {formattedPhoneNumber}
              </p>
            ) : (
              <p className="text-amber-600">
                No valid phone number found. Please update your profile.
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="mr-2 text-gray-700 dark:text-white">
              Sort by:
            </label>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border px-3 py-2 rounded dark:bg-gray-800 dark:text-white"
            >
              <option value="all">All</option>
              <option value="date">Modified by Date</option>
              <option value="time">Modified by Time</option>
            </select>
          </div>

          {filteredEvents.length === 0 ? (
            <p className="text-gray-500">No motion events found.</p>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {filteredEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-200 dark:shadow-gray-700"
                >
                  <img
                    src={event.photo}
                    alt="Motion"
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <p className="text-sm text-gray-600 dark:text-black">
                      Detected at:
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-black">
                      {formatTimestamp(event.timestamp)}
                    </p>

                    {event.detectedObjects.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 dark:text-black">
                          Detected Objects:
                        </p>
                        <ul className="list-disc pl-5 text-black dark:text-black">
                          {event.detectedObjects.map((obj, idx) => (
                            <li key={idx}>
                              {obj.label} (Confidence:{" "}
                              {(obj.confidence * 100).toFixed(0)}%)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="mt-4 flex justify-between items-center">
                      <span
                        className={`text-sm ${
                          event.notificationSent
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {event.notificationSent
                          ? "Notification sent"
                          : "No notification sent"}
                      </span>
                      {!event.notificationSent && formattedPhoneNumber && (
                        <button
                          onClick={() => sendNotificationManually(event)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                        >
                          Send notification
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};

export default MotionEvent;
