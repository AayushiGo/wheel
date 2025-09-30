import React, { useEffect, useRef, useState } from 'react';

import gsap from 'gsap';

const yearsData = [
  {
    year: '1983',
    title: 'Silicom France',
    desc: 'Silicom is the oldest cybersecurity consulting company in France',
  },
  {
    year: '2019',
    title: 'Expansion',
    desc: 'The company expanded into global cybersecurity markets.',
  },
  { year: '2021', title: 'Innovation', desc: 'Introduced AI-driven security solutions.' },
  { year: '2022', title: 'Recognition', desc: 'Awarded top cybersecurity firm in Europe.' },
  { year: '2023', title: 'Growth', desc: 'Doubled its workforce to support global clients.' },
  { year: '2024', title: 'Future', desc: 'Expanding into next-gen blockchain security.' },
];

const App = () => {
  const size = 300;
  const center = size / 2;
  const radius = size / 2.0;
  const angleStep = -270 / yearsData.length;

  const yearRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isScrolling = useRef(false);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    // Set initial rotation
    gsap.set(yearRef.current, {
      rotation: -activeIndex * angleStep,
      transformOrigin: '50% 50%',
    });

    const handleWheel = (e) => {
      e.preventDefault();

      const currentTime = Date.now();
      const timeDiff = currentTime - lastScrollTime.current;

      
      if (timeDiff < 500) return;

      if (isScrolling.current) return; // prevent multiple scrolls at once

      isScrolling.current = true;
      lastScrollTime.current = currentTime;

      const direction = e.deltaY > 0 ? 1 : -1;

      setActiveIndex((prevIndex) => {
        let newIndex = prevIndex + direction;

        // Stop at boundaries - no looping
        if (newIndex < 0) {
          newIndex = 0; // Stop at first year (1983)
        }
        if (newIndex >= yearsData.length) {
          newIndex = yearsData.length - 1; // Stop at last year (2024)
        }

        // Only animate if the index actually changed
        if (newIndex !== prevIndex) {
          gsap.to(yearRef.current, {
            rotation: -newIndex * angleStep,
            transformOrigin: '50% 50%',
            ease: 'power2.out',
            duration: 1.5,
            onComplete: () => {
              isScrolling.current = false;
            },
          });
        } else {
          // If no change, just reset the scrolling flag
          isScrolling.current = false;
        }

        return newIndex;
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [angleStep]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-10 bg-black font-['Gilroy'] text-white">
      {/* Wheel */}
      <div className='z-50 mb-8 flex items-center justify-center'>
        {/* Outer circle */}
        <div className='relative  flex h-[30rem] w-[30rem] items-center justify-center rounded-full border-[3rem] border-gray-900'>
          {/* Inner year circle */}
          <div
            ref={yearRef}
            className='relative rounded-full'
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
          >
            {yearsData.map((data, i) => {
              const angle = i * angleStep - 270;
              const x = center + radius * Math.cos((angle * Math.PI) / 180);
              const y = center + radius * Math.sin((angle * Math.PI) / 180);

              return (
                <div
                  key={i}
                  className={`absolute text-xl font-bold transition-colors duration-300 ${
                    i === activeIndex ? 'text-white' : 'text-gray-700'
                  }`}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  }}
                >
                  {data.year}
                </div>
              );
            })}
          </div>
        </div>
         
      </div>

      {/* Content section */}
      <div className='px-10 text-center'>
        <h2 className='mb-4 text-3xl font-semibold'>{yearsData[activeIndex].title}</h2>
        <p className='text-lg text-gray-300'>{yearsData[activeIndex].desc}</p>
      </div>
    </div>
  );
};

export default App;
