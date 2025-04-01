import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { server } from "../../server";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  getCalendarEvents,
  getEventRecommendations,
  addCalendarEvent,
  deleteCalendarEvent,
} from "../../redux/actions/calendar";

const EventCalendar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user || {});

  // Use default values to prevent destructuring errors
  const {
    events = [],
    recommendations = [],
    loading = false,
    recommendationsLoading = false,
    success = false,
    successMessage = null,
    error = null,
  } = useSelector((state) => state.calendar || {});

  const [value, setValue] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventData, setEventData] = useState({
    eventType: "birthday",
    date: new Date(),
    relatedPerson: "",
  });

  const eventTypes = [
    "birthday",
    "valentine",
    "anniversary",
    "new year",
    "graduation",
    "wedding",
  ];

  useEffect(() => {
    if (user) {
      dispatch(getCalendarEvents());
      dispatch(getEventRecommendations());
    }
  }, [dispatch, user]);

  // Reset form and close it when an event is successfully added
  useEffect(() => {
    if (success && successMessage) {
      setShowEventForm(false);
      setEventData({
        eventType: "birthday",
        date: new Date(),
        relatedPerson: "",
      });

      // Clear success message after 3 seconds
      const timer = setTimeout(() => {
        dispatch({ type: "clearCalendarMessages" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, successMessage, dispatch]);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch({ type: "clearCalendarErrors" });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    dispatch(
      addCalendarEvent({
        eventType: eventData.eventType,
        date: eventData.date,
        relatedPerson: eventData.relatedPerson,
      })
    );
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(deleteCalendarEvent(id));
    }
  };

  // Function to check if a date has an event
  const tileContent = ({ date, view }) => {
    if (view === "month" && events && events.length > 0) {
      const hasEvent = events.some((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      });

      return hasEvent ? (
        <div
          className="event-marker"
          style={{
            height: "5px",
            width: "5px",
            borderRadius: "50%",
            background: "#f0c14b",
            margin: "0 auto",
          }}
        ></div>
      ) : null;
    }
  };

  // Function to format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to properly format image URL - similar to how ProductCard does it
  const getImageUrl = (imageData) => {
    if (!imageData?.url) return "/placeholder-image.png";

    // If the URL is already a complete URL, use it directly
    if (imageData.url.startsWith("http")) {
      return imageData.url;
    }

    // Create a proper URL by handling path variations
    const baseUrl = server.replace(/\/api\/v2$/, "").replace(/\/$/, "");
    const imagePath = imageData.url.replace(/^\/?(uploads\/)?/, "");

    return `${baseUrl}/uploads/${imagePath}`;
  };

  return (
    <div className="w-full">
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Calendar Section */}
        <div className="md:w-1/2">
          <div className="w-full bg-white shadow rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-4">Your Calendar</h2>
            <Calendar
              onChange={setValue}
              value={value}
              tileContent={tileContent}
              className="w-full border-none"
            />

            <div className="mt-4">
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                onClick={() => setShowEventForm(!showEventForm)}
              >
                {showEventForm ? "Cancel" : "Add Event"}
              </button>
            </div>

            {showEventForm && (
              <div className="mt-4 p-4 border rounded">
                <h3 className="text-lg font-semibold mb-2">Add New Event</h3>
                <form onSubmit={handleAddEvent}>
                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      Event Type
                    </label>
                    <select
                      value={eventData.eventType}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          eventType: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                      required
                    >
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={
                        eventData.date instanceof Date
                          ? eventData.date.toISOString().split("T")[0]
                          : eventData.date
                      }
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          date: new Date(e.target.value),
                        })
                      }
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">
                      For Whom (Optional)
                    </label>
                    <input
                      type="text"
                      value={eventData.relatedPerson}
                      onChange={(e) =>
                        setEventData({
                          ...eventData,
                          relatedPerson: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded"
                      placeholder="e.g., Mom, Dad, Friend"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Event"}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Events List */}
          <div className="w-full mt-6 bg-white shadow rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-4">Your Events</h2>
            {loading ? (
              <p>Loading events...</p>
            ) : events && events.length === 0 ? (
              <p>No events found. Add some events to get started!</p>
            ) : (
              <div className="space-y-3">
                {events &&
                  events.map((event) => (
                    <div
                      key={event._id}
                      className="p-3 border rounded flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-semibold text-lg capitalize">
                          {event.eventType}
                        </h3>
                        <p className="text-gray-600">
                          {formatDate(event.date)}
                          {event.relatedPerson &&
                            ` - For: ${event.relatedPerson}`}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="text-red-600 hover:text-red-800"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="md:w-1/2">
          <div className="w-full bg-white shadow rounded-lg p-4">
            <h2 className="text-2xl font-bold mb-4">
              Upcoming Recommendations
            </h2>
            {recommendationsLoading ? (
              <p>Loading recommendations...</p>
            ) : recommendations && recommendations.length === 0 ? (
              <p>No upcoming event recommendations available.</p>
            ) : (
              <div className="space-y-6">
                {recommendations &&
                  recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="bg-gray-100 p-3">
                        <h3 className="text-lg font-semibold capitalize">
                          {rec.event.eventType}
                          {rec.event.relatedPerson &&
                            ` - For: ${rec.event.relatedPerson}`}
                        </h3>
                        <p className="text-gray-600">
                          {formatDate(rec.event.date)}
                        </p>
                      </div>

                      <div className="p-3">
                        <h4 className="font-medium mb-2">
                          Recommended Products:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {rec.products.map((product) => (
                            <div
                              key={product._id}
                              className="border rounded p-2 flex"
                            >
                              <img
                                src={getImageUrl(product.images[0])}
                                alt={product.name}
                                className="w-16 h-16 object-cover mr-2"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/placeholder-image.png";
                                }}
                                loading="lazy"
                              />
                              <div>
                                <h5 className="font-medium text-sm">
                                  {product.name}
                                </h5>
                                <p className="text-sm text-gray-600">
                                  Nrs.
                                  {product.discountPrice?.toFixed(2) ||
                                    product.originalPrice?.toFixed(2)}
                                </p>
                                <a
                                  href={`/product/${product.name
                                    .replace(/\s+/g, "-")
                                    .toLowerCase()}`}
                                  className="text-blue-600 text-sm hover:underline"
                                >
                                  View Product
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
