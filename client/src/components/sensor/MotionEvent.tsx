import React, { useEffect, useState, useRef } from "react";
import { createApiClient, ENDPOINTS } from "../../config/api";
import Layout from "../layouts/Layout";
import { notificationService } from "../../services/notificationService";
import { useAuth } from "../../context/AuthContext";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { RefreshCw, Play, Pause } from "lucide-react";

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
  const [refreshing, setRefreshing] = useState(false);
  const [sortOption, setSortOption] = useState("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { user } = useAuth();
  const latestEventIdRef = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const rawPhoneNumber =
    localStorage.getItem("userPhoneNumber") || user?.phoneNumber || "";
  const formattedPhoneNumber = formatPhoneNumber(rawPhoneNumber);

  const fetchEvents = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      
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
      setLastUpdated(new Date());

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
      if (showRefreshing) setRefreshing(false);
    }
  };

  const startAutoRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => fetchEvents(), refreshInterval * 1000);
  };

  const stopAutoRefresh = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    fetchEvents();
    if (autoRefresh) {
      startAutoRefresh();
    }
    return () => stopAutoRefresh();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }
  }, [autoRefresh, refreshInterval]);

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

  const handleManualRefresh = () => {
    fetchEvents(true);
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  return (
    <Layout>
      {loading ? (
        <p className="text-center text-gray-500">Loading events...</p>
      ) : (
        <div className="flex flex-col items-end w-full">
          <div className="w-full flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Motion Events</h2>
            
            {/* Auto-refresh controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 dark:text-white">
                  Refresh every:
                </label>
                <select
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  className="border px-2 py-1 rounded text-sm dark:bg-gray-800 dark:text-white"
                  disabled={!autoRefresh}
                >
                  <option value={10}>10s</option>
                  <option value={30}>30s</option>
                  <option value={60}>1m</option>
                  <option value={300}>5m</option>
                </select>
              </div>

              <button
                onClick={toggleAutoRefresh}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  autoRefresh
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {autoRefresh ? <Pause size={16} /> : <Play size={16} />}
                {autoRefresh ? "Stop Auto" : "Start Auto"}
              </button>

              <button
                onClick={handleManualRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors"
              >
                <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
                {refreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Status info */}
          <div className="w-full mb-4 text-sm space-y-1">
            {formattedPhoneNumber ? (
              <p className="text-green-600">
                Notifications will be sent to: {formattedPhoneNumber}
              </p>
            ) : (
              <p className="text-amber-600">
                No valid phone number found. Please update your profile.
              </p>
            )}
            
            {lastUpdated && (
              <p className="text-gray-500 dark:text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
                {autoRefresh && (
                  <span className="ml-2 inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Auto-refresh active
                  </span>
                )}
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