import React, { useState, useRef, useContext } from "react";
import Logo from "../assets/Logo.png";
import {appContext} from "../contexts/main"

function Form() {
  const {destination, setDest} = useContext(appContext);
  const [step, setStep] = useState(0);
  const sectionRef = useRef(null);
  return (
    <>
      <div className="h-screen w-screen m-auto">
        <div className="w-1/3 mt-30 m-auto flex flex-col">
          <img src={Logo} className="w-fit h-fit object-cover object-left" />
          <input
            type="text"
            onChange={(e) => {
              setDest(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setStep(step + 1);
                sectionRef.current?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            value={destination}
            className="m-auto w-full outline-none ring ring-[#321E5D] rounded-lg focus:ring-[#936FE0] ring p-2"
            placeholder="Enter your trip desitnation..."
          />
          {destination && <em className="text-gray-300 m-auto mt-2">Press enter</em>}
        </div>
      </div>
      <div ref={sectionRef}></div>
    </>
  );
}

export default Form;
