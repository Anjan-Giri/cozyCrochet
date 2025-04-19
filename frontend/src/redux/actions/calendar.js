import axios from "axios";
import { server } from "../../server";

// Get all calendar events
export const getCalendarEvents = () => async (dispatch) => {
  try {
    dispatch({ type: "GetCalendarEventsRequest" });

    // Add request logging
    console.log(`Sending GET request to: ${server}/calendar/events`);

    const { data } = await axios.get(`${server}/calendar/events`, {
      withCredentials: true,
    });

    // Log successful response
    console.log("Calendar events received:", data);

    dispatch({
      type: "GetCalendarEventsSuccess",
      payload: data.events,
    });
  } catch (error) {
    // Enhanced error handling
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to load calendar events";

    console.error("Get calendar events error:", {
      status: error.response?.status,
      message: errorMessage,
      path: "/calendar/events",
    });

    dispatch({
      type: "GetCalendarEventsFail",
      payload: errorMessage,
    });
  }
};

// Get recommendations for upcoming events
export const getEventRecommendations = () => async (dispatch) => {
  try {
    dispatch({ type: "GetEventRecommendationsRequest" });

    // Use the correct endpoint with your server URL
    const { data } = await axios.get(`${server}/calendar/recommendations`, {
      withCredentials: true,
    });

    dispatch({
      type: "GetEventRecommendationsSuccess",
      payload: data.recommendations,
    });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to load event recommendations";

    dispatch({
      type: "GetEventRecommendationsFail",
      payload: errorMessage,
    });
  }
};

// Add a calendar event
export const addCalendarEvent = (eventData) => async (dispatch) => {
  try {
    dispatch({ type: "AddCalendarEventRequest" });

    // Log the event data being sent
    console.log("Adding calendar event:", {
      ...eventData,
      date: new Date(eventData.date).toISOString(),
    });

    const { data } = await axios.post(
      `${server}/calendar/add-event`,
      eventData,
      { withCredentials: true }
    );

    dispatch({
      type: "AddCalendarEventSuccess",
      payload: {
        event: data.event,
        successMessage: "Event added successfully",
      },
    });

    // Refresh events list after adding
    dispatch(getCalendarEvents());
    dispatch(getEventRecommendations());
  } catch (error) {
    // Enhanced error handling
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to add calendar event";

    console.error("Add calendar event error:", {
      status: error.response?.status,
      message: errorMessage,
      data: eventData,
    });

    dispatch({
      type: "AddCalendarEventFail",
      payload: errorMessage,
    });
  }
};

// Update a calendar event
export const updateCalendarEvent = (id, eventData) => async (dispatch) => {
  try {
    dispatch({ type: "UpdateCalendarEventRequest" });

    // Log the event data being updated
    console.log(`Updating calendar event ${id}:`, eventData);

    const { data } = await axios.put(
      `${server}/calendar/update-event/${id}`,
      eventData,
      { withCredentials: true }
    );

    dispatch({
      type: "UpdateCalendarEventSuccess",
      payload: {
        event: data.event,
        successMessage: "Event updated successfully",
      },
    });

    // Refresh events list after updating
    dispatch(getCalendarEvents());
    dispatch(getEventRecommendations());
  } catch (error) {
    // Enhanced error handling
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to update calendar event";

    console.error("Update calendar event error:", {
      status: error.response?.status,
      message: errorMessage,
      eventId: id,
      data: eventData,
    });

    dispatch({
      type: "UpdateCalendarEventFail",
      payload: errorMessage,
    });
  }
};

// Delete a calendar event
export const deleteCalendarEvent = (id) => async (dispatch) => {
  try {
    dispatch({ type: "DeleteCalendarEventRequest" });

    // Log the event being deleted
    console.log(`Deleting calendar event: ${id}`);

    const { data } = await axios.delete(
      `${server}/calendar/delete-event/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: "DeleteCalendarEventSuccess",
      payload: {
        eventId: id,
        successMessage: data.message || "Event deleted successfully",
      },
    });

    // Refresh events list after deletion
    dispatch(getCalendarEvents());
    dispatch(getEventRecommendations());
  } catch (error) {
    // Enhanced error handling
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete calendar event";

    console.error("Delete calendar event error:", {
      status: error.response?.status,
      message: errorMessage,
      eventId: id,
    });

    dispatch({
      type: "DeleteCalendarEventFail",
      payload: errorMessage,
    });
  }
};

// Get smart recommendations
// export const getSmartRecommendations = () => async (dispatch) => {
//   try {
//     dispatch({ type: "GetSmartRecommendationsRequest" });

//     // Add request logging
//     console.log(
//       `Sending GET request to: ${server}/calendar/smart-recommendations`
//     );

//     const { data } = await axios.get(
//       `${server}/calendar/smart-recommendations`,
//       {
//         withCredentials: true,
//       }
//     );

//     // Log successful response
//     console.log("Smart recommendations received:", data);

//     dispatch({
//       type: "GetSmartRecommendationsSuccess",
//       payload: data.recommendations,
//     });
//   } catch (error) {
//     // Enhanced error handling
//     const errorMessage =
//       error.response?.data?.message ||
//       error.message ||
//       "Failed to load smart recommendations";

//     console.error("Get smart recommendations error:", {
//       status: error.response?.status,
//       message: errorMessage,
//     });

//     dispatch({
//       type: "GetSmartRecommendationsFail",
//       payload: errorMessage,
//     });
//   }
// };
