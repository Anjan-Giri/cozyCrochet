import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import ContactShop from "../components/Contact/ContactShop.jsx";
import ContactAdmin from "../components/Contact/ContactAdmin.jsx";

const ContactUsPage = () => {
  return (
    <>
      <Header />
      <ContactShop />
      <ContactAdmin />
      <Footer />
    </>
  );
};

export default ContactUsPage;
