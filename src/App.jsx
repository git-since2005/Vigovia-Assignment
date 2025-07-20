import React, { useState, useEffect } from "react";
import Form from "./Components/Form";
import { appContext } from "./contexts/main";
import Transfers from "./Components/Transfers";

function App() {
  useEffect(() => {
    localStorage.setItem(
      "transfers",
      JSON.stringify([{ from: "", to: "", time: "", type: "" }])
    );
  }, []);
  const [step, setStep] = useState();
  const [destination, setDest] = useState("")
  const [transfers, setTransfers] = useState([])
  const [activitiesList, setActivitiesList] = useState([])
  const [numberOfTravellers, setNumberOfTravellers] = useState(1)
  const [departurePlace, setDeparturePlace] = useState("")
  const [travelerName, setTravelerName] = useState("")
  const [numberOfDays, setNumberOfDays] = useState(0)
  return (
    <appContext.Provider value={{ 
      step, setStep, 
      destination, setDest, 
      setTransfers, transfers, 
      activitiesList, setActivitiesList,
      numberOfTravellers, setNumberOfTravellers,
      departurePlace, setDeparturePlace,
      travelerName, setTravelerName,
      numberOfDays, setNumberOfDays
    }}>
      <div className="flex flex-col h-full w-full scroll-hide overflow-x-hidden overflow-y-scroll snap-mandatory snap-y">
        <Form />
        <Transfers />
      </div>
    </appContext.Provider>
  );
}

export default App;
