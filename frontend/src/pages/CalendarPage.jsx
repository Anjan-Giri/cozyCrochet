import React from "react";
import Header from "../components/Layout/Header.jsx";
import Footer from "../components/Layout/Footer.jsx";
import EventCalendar from "../components/Calendar/EventCalendar.jsx";

const CalendarPage = () => {
  return (
    <div>
      <Header activeHeading={6} />
      <EventCalendar />
      <Footer />
    </div>
  );
};

export default CalendarPage;
