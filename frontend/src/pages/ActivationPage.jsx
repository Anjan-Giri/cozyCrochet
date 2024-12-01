import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const activateEmail = async () => {
        try {
          const res = await axios.post(`${server}/user/activation`, {
            activation_token,
          });
          console.log(res.data.message);
        } catch (error) {
          console.log(error.response.data.message);
          setError(true);
        }
      };
      activateEmail();
    }
  }, [activation_token]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      {error ? (
        <p className="text-red-600 text-2xl flex items-center font-bold">
          {/* <RxCross1 className="m-4" /> */}
          Token Expired!
          {/* <RxCross1 className="m-4" />{" "} */}
        </p>
      ) : (
        <p className="text-green-600 text-2xl flex items-center font-bold">
          Account Activated Successfully
        </p>
      )}
    </div>
  );
};

export default ActivationPage;
