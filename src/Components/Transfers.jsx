import React, { useState, useContext, useRef } from "react";
import TransferTable from "./Layouts/TransferTable";
import ActivityTable from "./Layouts/ActivityTable";
import GenerateItineraryPDF from "./GenerateItineraryPDF";
import { appContext } from "../contexts/main";

function Transfers() {
  const [step, setStep] = useState(1);
  const [days, setDays] = useState(0);
  const [transfersCount, setTransfersCount] = useState(0);
  const [currentTransfer, setCurrentTransfer] = useState(0);
  const [currentActivity, setCurrentActivity] = useState(0);
  const cardsRef = useRef(null);
  const { 
    transfers: contextTransfers, 
    setTransfers: setContextTransfers, 
    activitiesList, 
    setActivitiesList,
    numberOfTravellers,
    setNumberOfTravellers,
    departurePlace,
    setDeparturePlace,
    travelerName,
    setTravelerName,
    numberOfDays,
    setNumberOfDays
  } = useContext(appContext);

  const allTransfersFilled = () => {
    for (let i = 0; i < transfersCount; i++) {
      const t = contextTransfers[i] || {};
      if (!t.from || !t.to || !t.type || !t.time || !t.date) return false;
    }
    return true;
  };

  const allActivitiesFilled = () => {
    for (let i = 0; i < activitiesList.length; i++) {
      const a = activitiesList[i] || {};
      if (!a.name || !a.description || !a.price || !a.date || !a.time) return false;
    }
    return true;
  };

  const getAvailableDates = () => {
    const dates = [];
    contextTransfers.forEach(transfer => {
      if (transfer.date && !dates.includes(transfer.date)) {
        dates.push(transfer.date);
      }
    });
    return dates.sort();
  };

  const handleFinish = () => {
    if (step === 3 && !allTransfersFilled()) return;
    if (step === 4 && !allActivitiesFilled()) return;
    
    if (step === 3) {
      setStep(step + 1);
      const initialActivity = {
        name: '',
        description: '',
        price: '',
        date: getAvailableDates()[0] || '',
        time: ''
      };
      setActivitiesList([initialActivity]);
      setCurrentActivity(0);
    } else if (step === 4) {
      setStep(step + 1);
    }
  };

  const handleAddActivity = () => {
    const newActivity = {
      name: '',
      description: '',
      price: '',
      date: getAvailableDates()[0] || '',
      time: ''
    };
    setActivitiesList([...activitiesList, newActivity]);
    setCurrentActivity(activitiesList.length);
  };

  const handleRemoveActivity = () => {
    if (activitiesList.length > 1) {
      const updatedActivities = activitiesList.filter((_, index) => index !== currentActivity);
      setActivitiesList(updatedActivities);
      if (currentActivity >= updatedActivities.length) {
        setCurrentActivity(Math.max(0, updatedActivities.length - 1));
      }
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="flex h-full">
        <div className="h-full w-1/2 m-auto flex flex-col">
          <h1 className="text-3xl w-1/2 text-[#541C9C] mb-45 m-auto mt-7 ml-20">
            We will plan your entire trip plan,
          </h1>
          <p className="text-6xl text-[#321E5D] mt-0 m-auto ">
            PLAN. PACK. GO.
          </p>
        </div>
        
        {step === 1 && (
          <div className="flex flex-col w-1/2 h-full ">
            <div className="m-auto gap-4 flex flex-col ">
              <p className="text-[#680099] text-2xl ">
                Enter number of days for your trip
              </p>
              <input
                type="number"
                min={1}
                max={10}
                className=" outline-none focus:ring-[#936FE0] w-1/1 p-2 rounded-lg ring ring-[#321E5D] "
                placeholder="Enter no. of days"
                value={numberOfDays}
                onChange={(e) => {
                  setNumberOfDays(Number(e.target.value));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && numberOfDays > 0) {
                    setStep(step + 1);
                  }
                }}
              />
              
              <p className="text-[#680099] text-2xl mt-4">
                Number of travellers
              </p>
              <input
                type="number"
                min={1}
                max={20}
                className=" outline-none focus:ring-[#936FE0] w-1/1 p-2 rounded-lg ring ring-[#321E5D] "
                placeholder="Enter number of travellers"
                value={numberOfTravellers}
                onChange={(e) => {
                  setNumberOfTravellers(Number(e.target.value));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && numberOfTravellers > 0) {
                    setStep(step + 1);
                  }
                }}
              />
              
              <p className="text-[#680099] text-2xl mt-4">
                Traveler Name
              </p>
              <input
                type="text"
                className=" outline-none focus:ring-[#936FE0] w-1/1 p-2 rounded-lg ring ring-[#321E5D] "
                placeholder="Enter traveler name"
                value={travelerName}
                onChange={(e) => {
                  setTravelerName(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && travelerName.trim() && numberOfTravellers > 0) {
                    setStep(step + 1);
                  }
                }}
              />
              
              <p className="text-[#680099] text-2xl mt-4">
                Departure place
              </p>
              <input
                type="text"
                className=" outline-none focus:ring-[#936FE0] w-1/1 p-2 rounded-lg ring ring-[#321E5D] "
                placeholder="Enter departure place"
                value={departurePlace}
                onChange={(e) => {
                  setDeparturePlace(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && departurePlace.trim() && numberOfDays > 0 && numberOfTravellers > 0 && travelerName.trim()) {
                    setStep(step + 1);
                  }
                }}
              />
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="flex flex-col w-1/2 h-full ">
            <div className="m-auto gap-2 flex flex-col ">
              <p className="text-[#680099] text-2xl ">
                How many transfers will you have?
              </p>
              <input
                type="number"
                min={1}
                max={10}
                className=" outline-none focus:ring-[#936FE0] w-1/1 p-2 rounded-lg ring ring-[#321E5D] "
                placeholder="Enter no. of transfers"
                onChange={(e) => {
                  setTransfersCount(Number(e.target.value));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && transfersCount > 0) {
                    setStep(step + 1);
                  }
                }}
              />
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="w-1/2 h-full flex flex-col items-center justify-center">
            <TransferTable 
              number={currentTransfer} 
              transfers={contextTransfers}
              setTransfers={setContextTransfers}
            />
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setCurrentTransfer((prev) => Math.max(prev - 1, 0))}
                disabled={currentTransfer === 0}
                className={`p-2 text-2xl transition-opacity ${currentTransfer === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                &#8592;
              </button>
              <span className="text-gray-500 text-base">
                Transfer {currentTransfer + 1} of {transfersCount}
              </span>
              <button
                onClick={() => setCurrentTransfer((prev) => Math.min(prev + 1, transfersCount - 1))}
                disabled={currentTransfer === transfersCount - 1}
                className={`p-2 text-2xl transition-opacity ${currentTransfer === transfersCount - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                &#8594;
              </button>
            </div>
            {currentTransfer === transfersCount - 1 && (
              <button
                className={`mt-6 px-6 py-2 rounded text-white font-semibold transition-all duration-300 ${!allTransfersFilled() ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-[#936FE0] hover:bg-[#680099]'}`}
                onClick={handleFinish}
                disabled={!allTransfersFilled()}
              >
                Continue
              </button>
            )}
          </div>
        )}
        
        {step === 4 && (
          <div className="w-1/2 h-full flex flex-col items-center justify-center">
            <div className="mb-4">
              <p className="text-[#680099] text-2xl mb-2">Add activities for your transfer dates</p>
              <p className="text-gray-600 text-sm">Available dates: {getAvailableDates().join(', ')}</p>
            </div>
            <ActivityTable 
              number={currentActivity} 
              activities={activitiesList}
              setActivities={setActivitiesList}
              availableDates={getAvailableDates()}
            />
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setCurrentActivity((prev) => Math.max(prev - 1, 0))}
                disabled={currentActivity === 0}
                className={`p-2 text-2xl transition-opacity ${currentActivity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                &#8592;
              </button>
              <span className="text-gray-500 text-base">
                Activity {currentActivity + 1} of {activitiesList.length}
              </span>
              <button
                onClick={() => setCurrentActivity((prev) => Math.min(prev + 1, activitiesList.length - 1))}
                disabled={currentActivity === activitiesList.length - 1}
                className={`p-2 text-2xl transition-opacity ${currentActivity === activitiesList.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                &#8594;
              </button>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                className="px-4 py-2 rounded text-white font-semibold bg-[#541C9C] hover:bg-[#680099] transition-all duration-300"
                onClick={handleAddActivity}
              >
                + Add Another Activity
              </button>
              {activitiesList.length > 1 && (
                <button
                  className="px-4 py-2 rounded text-red-600 font-semibold border hover:bg-red-500 hover:text-white transition border-red-600"
                  onClick={handleRemoveActivity}
                >
                  Remove Activity
                </button>
              )}
            </div>
            {currentActivity === activitiesList.length - 1 && (
              <button
                className={`mt-6 px-6 py-2 rounded text-white font-semibold transition-all duration-300 ${!allActivitiesFilled() ? 'opacity-50 cursor-not-allowed bg-gray-400' : 'bg-[#936FE0] hover:bg-[#680099]'}`}
                onClick={handleFinish}
                disabled={!allActivitiesFilled()}
              >
                Continue
              </button>
            )}
          </div>
        )}
        
        {step === 5 && (
          <div className="w-1/2 h-full flex flex-col items-center justify-center">
            <h2 className="text-3xl text-[#541C9C] mb-4">Trip Planning Complete!</h2>
            <p className="text-lg text-gray-600 mb-6">Your trip has been successfully planned with transfers and activities.</p>
            <GenerateItineraryPDF />
          </div>
        )}
      </div>
    </div>
  );
}

export default Transfers;
