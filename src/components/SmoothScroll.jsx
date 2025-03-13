import Scrollbar from "smooth-scrollbar";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = ({ children }) => {
  const scrollbarRef = useRef(null);

  useEffect(() => {
    // Initialize smooth-scrollbar
    const scrollbar = Scrollbar.init(scrollbarRef.current, {
      damping: 0.05,
      thumbMinSize: 20,
      renderByPixels: true,
      continuousScrolling: true,
      alwaysShowTracks: true,
      plugins: {
        overscroll: {
          effect: "bounce",
          damping: 0.15,
          maxOverscroll: 150,
        },
      },
    });

    // Set ScrollTrigger to use smooth-scrollbar
    ScrollTrigger.scrollerProxy(scrollbarRef.current, {
      scrollTop(value) {
        if (arguments.length) {
          scrollbar.scrollTop = value;
        }
        return scrollbar.scrollTop;
      },
    });

    // Update ScrollTrigger on scroll
    scrollbar.addListener(() => {
      ScrollTrigger.update();
    });

    return () => {
      scrollbar.destroy();
    };
  }, []);

  return (
    <div ref={scrollbarRef} style={{ height: "100vh", overflow: "hidden" }}>
      <div style={{ minHeight: "200vh" }}>{children}</div>
    </div>
  );
};

export default SmoothScroll;
