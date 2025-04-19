import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  events: [],
  recommendations: [],
  // smartRecommendations: [],
  loading: false,
  recommendationsLoading: false, // Added this field that was missing
  success: false,
  error: null,
  successMessage: null,
};

// Export the reducer properly
export const calendarReducer = createReducer(initialState, (builder) => {
  builder
    // Get calendar events
    .addCase("GetCalendarEventsRequest", (state) => {
      state.loading = true;
    })
    .addCase("GetCalendarEventsSuccess", (state, action) => {
      state.loading = false;
      state.events = action.payload;
    })
    .addCase("GetCalendarEventsFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Get event recommendations
    .addCase("GetEventRecommendationsRequest", (state) => {
      state.recommendationsLoading = true;
    })
    .addCase("GetEventRecommendationsSuccess", (state, action) => {
      state.recommendationsLoading = false;
      state.recommendations = action.payload;
    })
    .addCase("GetEventRecommendationsFail", (state, action) => {
      state.recommendationsLoading = false;
      state.error = action.payload;
    })

    // Add calendar event
    .addCase("AddCalendarEventRequest", (state) => {
      state.loading = true;
    })
    .addCase("AddCalendarEventSuccess", (state, action) => {
      state.loading = false;
      state.success = true;
      state.successMessage = action.payload.successMessage;
    })
    .addCase("AddCalendarEventFail", (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    })

    // Update calendar event
    .addCase("UpdateCalendarEventRequest", (state) => {
      state.loading = true;
    })
    .addCase("UpdateCalendarEventSuccess", (state, action) => {
      state.loading = false;
      state.success = true;
      state.successMessage = action.payload.successMessage;
    })
    .addCase("UpdateCalendarEventFail", (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    })

    // Delete calendar event
    .addCase("DeleteCalendarEventRequest", (state) => {
      state.loading = true;
    })
    .addCase("DeleteCalendarEventSuccess", (state, action) => {
      state.loading = false;
      state.success = true;
      state.successMessage = action.payload.successMessage;
    })
    .addCase("DeleteCalendarEventFail", (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    })

    // .addCase("GetSmartRecommendationsRequest", (state) => {
    //   state.recommendationsLoading = true;
    // })
    // .addCase("GetSmartRecommendationsSuccess", (state, action) => {
    //   state.recommendationsLoading = false;
    //   state.smartRecommendations = action.payload;
    // })
    // .addCase("GetSmartRecommendationsFail", (state, action) => {
    //   state.recommendationsLoading = false;
    //   state.error = action.payload;
    // })

    // Clear errors and messages
    .addCase("clearCalendarErrors", (state) => {
      state.error = null;
    })
    .addCase("clearCalendarMessages", (state) => {
      state.successMessage = null;
      state.success = false;
    });
});
