// import React, { useEffect, useState } from "react";

// const Timer = () => {
//   function calculateTimeLeft() {
//     const difference = +new Date("2024-12-16") - +new Date();
//     let timeLeft = {};

//     if (difference > 0) {
//       timeLeft = {
//         days: Math.floor(difference / (1000 * 60 * 60 * 24)),
//         hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
//         minutes: Math.floor((difference / 1000 / 60) % 60),
//         seconds: Math.floor((difference / 1000) % 60),
//       };
//     }

//     return timeLeft;
//   }

//   const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setTimeLeft(calculateTimeLeft());
//     }, 1000);

//     return () => clearTimeout(timer);
//   });

//   const timerComp = Object.keys(timeLeft).map((interval) => {
//     if (!timeLeft[interval]) {
//       return null;
//     }

//     return (
//       <span className="text-[25px] text-[#1fb123]">
//         {timeLeft(interval)} {interval} {""}
//       </span>
//     );
//   });

//   return (
//     <div>
//       {timerComp.length ? (
//         timerComp
//       ) : (
//         <span className="text-[#d62626] text-[23px]">Time's Up!!!</span>
//       )}
//     </div>
//   );
// };

// export default Timer;

import React, { useEffect, useState } from "react";

const Timer = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date("2024-12-11") - +new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return null; // Time's up
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer); // Cleanup
  }, []);

  if (!timeLeft) {
    return (
      <div>
        <span className="text-[#d62626] text-[23px]">Time's Up!!!</span>
      </div>
    );
  }

  return (
    <div>
      {Object.entries(timeLeft).map(([interval, value]) => (
        <span key={interval} className="text-[20px] text-[#1fb123]">
          {value} {interval}{" "}
        </span>
      ))}
    </div>
  );
};

export default Timer;
