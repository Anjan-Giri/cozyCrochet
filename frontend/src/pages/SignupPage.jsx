import { React, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import SignUp from "../components/SignUp.jsx";

const SignupPage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <SignUp />
    </div>
  );
};

export default SignupPage;
