"use client";
import React from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

function authLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const route = useRouter();
  const handleClick = () => {
    if(pathname?.startsWith("/sign-up")){
      route.push("/sign-in")
    }
    else{
    route.push("/sign-up")
    }
  }
  console.log(pathname );
  return (
    <div className="relative bg-gradient-to-b from-[#202020] to-[#343434] overflow-hidden text-white flex flex-col items-center justify-center md:px-8 px-3  w-full   ">
      <div className="max-w-[1500px] mx-auto mb-10">
        {/* Navigation Bar */}
        <header className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-6">
          <div className="flex items-center space-x-2">
            <div className="size-4 bg-white rounded-full animate-ping" />
            <h1 className="text-xl font-bold">Chat</h1>
          </div>
          <button
            className="px-5 py-2 bg-white text-black rounded-full text-sm font-semibold shadow hover:bg-zinc-200"
            onClick={handleClick}
          >
            {pathname?.startsWith("/sign-up") ? "Log In" : "Create new account"}
          </button>
        </header>

        {/* Hero Section */}
        <div className="lg:grid lg:grid-cols-8  ">
          <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mt-28 lg:mt-48 gap-12 col-span-4  ">
            {/* Left Text Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1"
            >
              <h1 className="text-5xl lg:text-6xl/none font-extrabold ">
                GROUP CHAT<br />  THAT’S ALL FUN & GAMES
              </h1>
              <p className="text-zinc-300 mt-6  text-lg/7">
                This system is great for playing games and chilling with
                friends, or even building a worldwide community. Customize your
                own space to talk, play, and hang out.
              </p>
            </motion.div>

            {/* Right Image Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 relative w-full h-40 "
            >
              <motion.img
                src="/images/ch4.png"
                alt="Mobile preview"
                className="lg:absolute top-4 left-64 w-32 z-50 rounded-xl blur-sm"
                animate={{ y: [0, -10, 0], rotate:[0,30,0] }}
                transition={{ duration: 10, repeat: Infinity }}
              />
              <motion.div
                className=" absolute top-32 left-10 size-2 bg-white blur-sm rounded-full  animate-pulse"
                animate={{ y: [0, -25, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 8, repeat: Infinity }}
              />

              <motion.div
                className=" absolute top-8 right-10 size-8 bg-white blur-lg rounded-full  animate-pulse"
                animate={{ y: [0, -25, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 11, repeat: Infinity }}
              />
              <motion.div
                className=" absolute top-24 right-40 size-2 bg-white blur-sm rounded-full  animate-pulse"
                animate={{ y: [0, -25, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 12, repeat: Infinity }}
              />
            </motion.div>
          </div>
          <div className="col-span-1" />
          <div className="col-span-3 flex justify-end sm:justify-center lg:pt-32 ">
            <div className="rounded-2xl relative h-[645px] border-white flex items-end justify-center">
              <motion.img
                src="/images/ch3.png"
                alt="Mobile preview"
                className="absolute z-50 -left-[175px] top-[247px] w-[230px] rounded-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              />

              {children}
            </div>
          </div>
        </div>

        {/* Background Floating Elements */}
        <motion.div
          className="absolute top-32 left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl"
          animate={{ y: [0, -25, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-20 size-6 bg-white rounded-full blur-md"
          animate={{ y: [0, -25, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-96 left-40 size-4 bg-white rounded-full blur-sm animate-ping"
          animate={{ y: [0, -25, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="  translate-x-3/4 absolute top-32 size-4 bg-white rounded-full blur-lg animate-pulse"
          animate={{ y: [0, -25, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>
    </div>
  );
}

export default authLayout;
