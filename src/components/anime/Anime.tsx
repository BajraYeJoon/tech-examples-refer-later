import { useEffect, useRef, useState } from "react";
import {
  animate,
  createDraggable,
  createScope,
  createSpring,
  createTimer,
  waapi,
} from "animejs";
import { Button } from "../ui/button";
import { toast } from "sonner";

function Anime() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scopeRef = useRef<ReturnType<typeof createScope> | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const scope = createScope({ root: containerRef });

    scope.add(() => {
      createDraggable(".logo", {
        container: [0, 0, 0, 0],
        releaseEase: createSpring({
          stiffness: 100,
        }),
      });
    });

    scope.add("morph", () => {
      animate(".morph-circle", {
        borderRadius: ["50%", "0%"],
        rotate: 360,
        scale: [1, 1.5, 1],
        duration: 2000,
        loop: false,
      });
    });

    scope.add("timer", () => {
      createTimer({
        duration: 8000,
        playbackRate: 0.5,
        loop: false,
        frameRate: 60,
        delay: 1000,
        onBegin: (self) => {
          toast.success(
            `Time started at ${(self.currentTime / 1000).toFixed(2)}s`
          );
        },

        onComplete: (self) => {
          toast.success(
            `Time ended at ${(self.currentTime / 1000).toFixed(2)}s`
          );
        },
        onUpdate: (self) => {
          animate(".timer-circle", {
            rotate: self.progress * 360,
          });
          animate(".timer-progress", {
            width: `${self.progress * 100}%`,
            backgroundColor: `hsl(${self.progress * 200}, 60%, 50%)`,
            filter: `blur(${10 - self.progress * 8}px)`,
          });
          setCurrentTime(Math.round(self.currentTime));
        },
      });
    });

    // scope.add("idleCheck", () => {
    //   createTimer({
    //     duration: 5000,
    //     onUpdate: (self) => {
    //       if (self.progress > 0.8 && !idle) {
    //         animate(".idle-warning", {
    //           opacity: [0, 1],
    //           translateY: [-20, 0],
    //           duration: 500,
    //         });
    //       }
    //     },
    //     onComplete: () => {
    //       setIdle(true);
    //       animate(".content", {
    //         opacity: 0.5,
    //         duration: 500,
    //       });
    //     },
    //   });
    // });

    animate(".text", {
      // Property keyframes
      y: [
        { to: "-2.75rem", ease: "outExpo", duration: 600 },
        { to: 0, ease: "outBounce", duration: 800, delay: 100 },
      ],
      // Property specific parameters
      rotate: {
        from: "-1turn",
        delay: 0,
      },
      delay: (_, i) => i * 50, // Function based value
      ease: "inOutCirc",
      loopDelay: 1000,

      // loop: true,
    });

    animate(".square", {
      x: "17em",
      rotate: "1turn",
      borderRadius: 64,
      filter: "blur(10px)",
      duration: 1000,
      alternate: true,
      ease: "cubicBezier(0.25, 0.1, 0.25, 1.0)",
    });

    waapi.animate(".square2", {
      transform: "translateX(15rem) scale(1.5) skew(-10deg) rotate(1turn)",
    });

    // animate(".square2", {
    //   x: "17em",
    //   translateY: ["0em", "1em", "0em"],
    //   duration: 1000,
    //   alternate: true,
    // });

    animate(".square3", {
      x: "17em",
      scale: [1, 1.5, 1],
      duration: 1000,
      alternate: true,
    });

    animate(".floating-card", {
      x: (el: unknown) => (el as HTMLElement).getAttribute("data-x"),

      y: (_: unknown, i: number) => {
        const baseY = 100;
        return baseY + Math.sin(i) * 50;
      },

      scale: (_: unknown, i: number) => {
        const baseScale = 1;
        return baseScale - i * 0.1;
      },

      rotate: () => {
        return Math.random() * 20 - 10;
      },

      borderRadius: () => {
        return `${8 + Math.random() * 8}px`;
      },

      duration: () => {
        return 2000 + Math.random() * 1000;
      },

      delay: (_: unknown, i: number) => i * 200,
      ease: "outElastic(1, .5)",
      opacity: [0.8, 1],
      boxShadow: ["0 4px 6px rgba(0,0,0,0.1)", "0 10px 15px rgba(0,0,0,0.2)"],
    });

    animate(".tween1", {
      x: {
        to: "16rem",
        ease: "inExpo",
      },
      rotate: {
        to: "1turn",
        ease: "inOut",
      },
    });

    scopeRef.current = scope;

    return () => scope.revert();
  }, []);

  const alternateTimer = () => {
    if (scopeRef.current) {
      const timer = scopeRef.current.methods.timer();
      if (timer) {
        timer.pause();
      }
    }
  };

  const handleAnimationClick = (animation: string) => {
    if (scopeRef.current) {
      scopeRef.current.methods[animation]();
    }
  };

  // const handleActivity = () => {
  //   if (idle) {
  //     setIdle(false);
  //     animate(".content", {
  //       opacity: 1,
  //       duration: 500,
  //     });
  //     animate(".idle-warning", {
  //       opacity: 0,
  //       duration: 300,
  //     });
  //   }
  //   scopeRef.current?.methods.idleCheck();
  // };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <div ref={containerRef} className="p-8">
      <div className="mb-8">
        <img src="/public/vite.svg" alt="" className="logo" />
      </div>

      <div className="my-8">
        <Button onClick={() => handleAnimationClick("morph")}>Morph</Button>
        <div className="morph-circle w-24 h-24 bg-green-500" />
      </div>

      <div className="my-8">
        <Button onClick={() => handleAnimationClick("timer")}>Timer</Button>
        <Button onClick={alternateTimer}>Alternate</Button>
        <div className="mt-2 text-xl font-mono">
          Time: {(currentTime / 1000).toFixed(2)}s
        </div>

        <div className="timer-circle w-24 h-24 bg-blue-500" />

        <div className="relative mt-4  h-4 w-full bg-blue-500 rounded-full overflow-hidden">
          <div
            className="timer-progress absolute top-0 left-0 h-full bg-primary"
            style={{
              width: "0%",
              transition: "filter 0.3s ease",
            }}
          />
        </div>

        {/* <div onMouseMove={handleActivity} onClick={handleActivity}>
          <div className="content w-4/5  h-24 border m-4 p-2">
            hi there hello ther e
          </div>
          <div className="idle-warning fixed top-4 right-4 bg-green-100 text-black  p-4 rounded-md opacity-0">
            Are you still there?
          </div>
        </div> */}

        <div className="inline-block text-4xl ">
          {"Hello World".split("").map((char, i) => (
            <span
              key={`char-${i}-${char}`}
              className="origin-center text inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </div>

        <div
          className="square w-24 h-24 "
          style={{
            backgroundColor: "red",
          }}
        />
        <div className="square2 w-24 h-24 bg-green-500" />
        <div className="square3 w-24 h-24 bg-blue-500" />

        <div className="relative h-[400px] w-full bg-slate-900 rounded-lg p-8 mt-8">
          <div
            className="floating-card absolute p-6 rounded-lg bg-purple-500 shadow-lg"
            data-x="200"
          >
            <h3 className="text-white font-bold">Animation</h3>
            <p className="text-white/80">Smooth transitions</p>
          </div>

          <div
            className="floating-card absolute p-6 rounded-lg bg-blue-500 shadow-lg"
            data-x="400"
          >
            <h3 className="text-white font-bold">Interaction</h3>
            <p className="text-white/80">Dynamic effects</p>
          </div>

          <div
            className="floating-card absolute p-6 rounded-lg bg-green-500 shadow-lg"
            data-x="600"
          >
            <h3 className="text-white font-bold">Experience</h3>
            <p className="text-white/80">Engaging design</p>
          </div>
        </div>

        <div>
          <div className="tween1 w-24 h-12 bg-orange-500" />
        </div>
      </div>
    </div>
  );
}

export default Anime;
