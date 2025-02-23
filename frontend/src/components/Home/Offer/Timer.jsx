// import React, { useEffect, useState } from "react";

// const Timer = () => {
//   const calculateTimeLeft = () => {
//     const difference = +new Date("2024-12-11") - +new Date();
//     if (difference > 0) {
//       return {
//         days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//         hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//         minutes: Math.floor((difference / 1000 / 60) % 60),
//         seconds: Math.floor((difference / 1000) % 60),
//       };
//     }
//     return null; // Time's up
//   };

//   const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft(calculateTimeLeft());
//     }, 1000);

//     return () => clearInterval(timer); // Cleanup
//   }, []);

//   if (!timeLeft) {
//     return (
//       <div>
//         <span className="text-[#d62626] text-[23px]">Time's Up!!!</span>
//       </div>
//     );
//   }

//   return (
//     <div>
//       {Object.entries(timeLeft).map(([interval, value]) => (
//         <span key={interval} className="text-[20px] text-[#1fb123]">
//           {value} {interval}{" "}
//         </span>
//       ))}
//     </div>
//   );
// };

// export default Timer;

import React, { useEffect, useState } from "react";

const Timer = ({ endDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(endDate) - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) {
    return (
      <div className="text-red-600 font-bold text-center">Offer Expired!</div>
    );
  }

  return (
    <div className="flex justify-around bg-[#d7c1a9] p-4 rounded-lg">
      {Object.entries(timeLeft).map(([interval, value]) => (
        <div key={interval} className="text-center">
          <div className="text-xl font-bold text-[#48004f]">{value}</div>
          <div className="text-sm text-gray-600">{interval}</div>
        </div>
      ))}
    </div>
  );
};

export default Timer;
