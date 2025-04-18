import React, { useEffect, useState } from "react";

// Unified background component that can be used by both Admin and User login pages
const CrochetBackground = () => {
  // Array of colors for yarn balls and circles
  const colors = [
    "#f472b6", // Pink
    "#a855f7", // Purple
    "#60a5fa", // Blue
    "#34d399", // Green
    "#fbbf24", // Yellow
    "#fb923c", // Orange
    "#f87171", // Red
    "#d8b4fe", // Lavender
    "#c4b5fd", // Light purple
    "#bae6fd", // Light blue
  ];

  // Generate items for background
  const generateBackgroundItems = () => {
    const items = [];

    // Generate yarn balls
    for (let i = 0; i < 6; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const darkColor = adjustColorBrightness(color, -30); // Darker shade for details

      items.push({
        element: (
          <svg
            key={`yarn-${i}`}
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="60" cy="60" r="50" fill={color} fillOpacity="0.8" />
            <path
              d="M30,60 Q60,20 90,60"
              stroke={darkColor}
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M30,60 Q60,100 90,60"
              stroke={darkColor}
              strokeWidth="3"
              fill="none"
            />
            <path
              d="M40,50 Q60,30 80,50"
              stroke={darkColor}
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M40,70 Q60,90 80,70"
              stroke={darkColor}
              strokeWidth="2"
              fill="none"
            />
          </svg>
        ),
        type: "yarn",
      });
    }

    // Generate crochet hooks
    for (let i = 0; i < 3; i++) {
      const hookColor = "#9333ea"; // Purple hook color

      items.push({
        element: (
          <svg
            key={`hook-${i}`}
            width="200"
            height="50"
            viewBox="0 0 200 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="10"
              y="20"
              width="160"
              height="10"
              rx="5"
              fill={hookColor}
            />
            <path
              d="M170,25 Q190,25 180,40"
              stroke={hookColor}
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
            />
            <rect
              x="10"
              y="15"
              width="50"
              height="20"
              rx="5"
              fill={adjustColorBrightness(hookColor, 20)}
            />
          </svg>
        ),
        type: "hook",
      });
    }

    // Generate circles (from admin login)
    for (let i = 0; i < 6; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 16 + Math.floor(Math.random() * 12); // 16-28px

      items.push({
        element: (
          <div
            key={`circle-${i}`}
            className={`w-${size} h-${size} rounded-full`}
            style={{
              backgroundColor: color,
              width: `${size}px`,
              height: `${size}px`,
              opacity: 0.3 + Math.random() * 0.3, // 0.3-0.6 opacity
            }}
          ></div>
        ),
        type: "circle",
      });
    }

    return items;
  };

  // Helper function to adjust color brightness
  const adjustColorBrightness = (hex, percent) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;

    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 0 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  };

  // State for background items
  const [items, setItems] = useState([]);

  useEffect(() => {
    const backgroundItems = generateBackgroundItems();
    const newItems = [];

    backgroundItems.forEach((item, i) => {
      // Different positioning logic depending on item type
      let left, top, rotation, duration, delay, scale;

      // Common properties for all types
      left = 5 + Math.random() * 90; // 5-95%
      top = 5 + Math.random() * 90; // 5-95%
      delay = Math.random() * 5; // 0-5s

      if (item.type === "yarn") {
        rotation = Math.random() * 360;
        duration = 30 + Math.random() * 20; // 30-50s
        scale = 0.7 + Math.random() * 0.4; // 0.7-1.1
      } else if (item.type === "hook") {
        rotation = Math.random() * 180;
        duration = 35 + Math.random() * 15; // 35-50s
        scale = 0.6 + Math.random() * 0.3; // 0.6-0.9
      } else {
        // circle
        rotation = 0;
        duration = 15 + Math.random() * 15; // 15-30s
        scale = 0.8 + Math.random() * 0.6; // 0.8-1.4
      }

      newItems.push({
        element: item.element,
        style: {
          position: "absolute",
          left: `${left}%`,
          top: `${top}%`,
          transform: `rotate(${rotation}deg) scale(${scale})`,
          opacity: item.type === "circle" ? undefined : 0.6,
          animation: `float-${i} ${duration}s infinite ease-in-out ${delay}s`,
          zIndex: Math.floor(Math.random() * 5),
        },
        keyframes: `
          @keyframes float-${i} {
            0% {
              transform: translate(0, 0) rotate(${rotation}deg) scale(${scale});
            }
            33% {
              transform: translate(${Math.random() * 40 - 20}px, ${
          Math.random() * 40 - 20
        }px) rotate(${
          rotation + (item.type === "circle" ? 0 : 5)
        }deg) scale(${scale});
            }
            66% {
              transform: translate(${Math.random() * 40 - 20}px, ${
          Math.random() * 40 - 20
        }px) rotate(${rotation - (item.type === "circle" ? 0 : 5)}deg) scale(${
          scale + (item.type === "circle" ? 0.1 : 0)
        });
            }
            100% {
              transform: translate(0, 0) rotate(${rotation}deg) scale(${scale});
            }
          }
        `,
      });
    });

    setItems(newItems);
  }, []);

  return (
    <>
      <style>{items.map((item) => item.keyframes).join("\n")}</style>
      <div className="absolute inset-0 overflow-hidden">
        {items.map((item, index) => (
          <div key={index} style={item.style}>
            {item.element}
          </div>
        ))}
      </div>
    </>
  );
};

export default CrochetBackground;
