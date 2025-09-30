import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const yearsData = [
  {
    year: "1983",
    title: "Silicom France",
    desc: "Silicom is the oldest cybersecurity consulting company in France",
  },
  {
    year: "2019",
    title: "Expansion",
    desc: "The company expanded into global cybersecurity markets.",
  },
  {
    year: "2021",
    title: "Innovation",
    desc: "Introduced AI-driven security solutions.",
  },
  {
    year: "2022",
    title: "Recognition",
    desc: "Awarded top cybersecurity firm in Europe.",
  },
  {
    year: "2023",
    title: "Growth",
    desc: "Doubled its workforce to support global clients.",
  },
  {
    year: "2024",
    title: "Future",
    desc: "Expanding into next-gen blockchain security.",
  },
];

const App = () => {
  const size = 300;
  const center = size / 2;
  const radius = size / 2.0;
  const angleStep = -270 / yearsData.length;

  const yearRef = useRef(null);
  const squareRefs = useRef([]); // array of refs for the small squares
  const [activeIndex, setActiveIndex] = useState(0);
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(0);

  // initial setup: set rotation and baseline scales
  useEffect(() => {
    if (yearRef.current) {
      gsap.set(yearRef.current, {
        rotation: -activeIndex * angleStep,
        transformOrigin: "50% 50%",
      });
    }

    // baseline for squares
    squareRefs.current.forEach((el) => {
      if (el) gsap.set(el, { scale: 1, transformOrigin: "50% 50%" });
    });

    // make the initial active one appear "active"
    const activeEl = squareRefs.current[activeIndex];
    if (activeEl) {
      gsap.set(activeEl, { scale: 1.8, backgroundColor: "#a78bfa" }); // purple-ish
    }
    
  }, []);

  
  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();

      const currentTime = Date.now();
      const timeDiff = currentTime - lastScrollTime.current;
      if (timeDiff < 500) return;
      if (isScrolling.current) return;

      isScrolling.current = true;
      lastScrollTime.current = currentTime;

      const direction = e.deltaY > 0 ? 1 : -1;

      setActiveIndex((prevIndex) => {
        let newIndex = prevIndex + direction;
        if (newIndex < 0) newIndex = 0;
        if (newIndex >= yearsData.length) newIndex = yearsData.length - 1;

        if (newIndex === prevIndex) {
          // no change
          isScrolling.current = false;
          return prevIndex;
        }

        const tl = gsap.timeline({
          onComplete: () => {
            isScrolling.current = false;
          },
        });

        tl.to(
          yearRef.current,
          {
            rotation: -newIndex * angleStep,
            transformOrigin: "50% 50%",
            ease: "power2.out",
            duration: 1.5,
          },
          0
        );

        const prevEl = squareRefs.current[prevIndex];
        const newEl = squareRefs.current[newIndex];

        if (prevEl) {
          tl.to(
            prevEl,
            {
              scale: 1,
              duration: 0.35,
              ease: "power2.out",
            },
            0
          );
          tl.to(prevEl, { backgroundColor: "#374151", duration: 0.2 }, 0); // gray-700
        }

        if (newEl) {
          tl.to(newEl, { scale: 1, duration: 0.32, ease: "power1.out" }, 0);
          tl.to(newEl, { scale: 2, duration: 0.32, ease: "power1.out" }, ">");
          tl.to(newEl, { scale: 3, duration: 0.86, ease: "power2.out" }, ">");

          tl.to(newEl, { backgroundColor: "#9333EA", duration: 0.2 }, 0);
        }

        return newIndex;
      });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [angleStep]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-10 bg-black font-['Gilroy'] text-white">
      {/* Wheel */}
      <div className="z-50 flex items-center justify-center">
        <div className="relative flex h-[30rem] w-[30rem] items-center justify-center rounded-full border-[3rem] border-gray-900">
          {/* Rotating inner circle */}
          <div
            ref={yearRef}
            className="relative rounded-full"
            style={{ width: `${size}px`, height: `${size}px` }}
          >
            {yearsData.map((data, i) => {
              const angle = i * angleStep - 270;

              // Year position
              const yearX = center + radius * Math.cos((angle * Math.PI) / 180);
              const yearY = center + radius * Math.sin((angle * Math.PI) / 180);

              // Opacity for fading text (keeps same behavior you had)
              const angleDiff = Math.abs(i - activeIndex) * Math.abs(angleStep);
              const opacity = Math.max(0, 1 - angleDiff / 90);

              // Square position (slightly outside)
              const squareRadius = radius + 115;
              const squareX =
                center + squareRadius * Math.cos((angle * Math.PI) / 180);
              const squareY =
                center + squareRadius * Math.sin((angle * Math.PI) / 180);

              return (
                <React.Fragment key={i}>
                  {/* Year text */}
                  <div
                    className="absolute text-xl font-bold transition-colors duration-300 pointer-events-none"
                    style={{
                      left: `${yearX}px`,
                      top: `${yearY}px`,
                      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                      opacity: opacity,
                      color: i === activeIndex ? "white" : "#7c7c7c",
                    }}
                  >
                    {data.year}
                  </div>

                  <div
                    ref={(el) => (squareRefs.current[i] = el)}
                    className="absolute w-1 h-1"
                    style={{
                      left: `${squareX}px`,
                      top: `${squareY}px`,
                      transform: `translate(-50%, -50%) rotate(${-angle}deg)`,
                      backgroundColor:
                        i === activeIndex ? "#a78bfa" : "#ffffff",
                    }}
                  ></div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-3 h-3  z-50 -mt-[21px] bg-purple-600"></div>

      {/* Content section */}
      <div className="px-10 text-center">
        <h2 className="mb-4 text-3xl font-semibold">
          {yearsData[activeIndex].title}
        </h2>
        <p className="text-lg text-gray-300">{yearsData[activeIndex].desc}</p>
      </div>
    </div>
  );
};

export default App;
