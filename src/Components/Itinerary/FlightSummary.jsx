import React, { useContext } from 'react'
import { appContext } from '../../contexts/main'

function FlightSummary({ departureDate }) {
    const { departurePlace, destination } = useContext(appContext)
    
    return (
        <div className="p-2 rounded-lg">            
            {/* Date Display */}
            <div className="flex border-2 border-[#541C9C] rounded-lg">
                <div className="bg-pink-100 p-3 w-fit border-r-2 border-[#541C9C] rounded-tl-lg rounded-bl-lg rounded-tr-[1.25rem] rounded-br-[1.25rem] relative">
                    <p className="font-semibold w-45 text-black">
                        {departureDate ? new Date(departureDate).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'short', 
                            year: '2-digit' 
                        }).replace(/\d{2}$/, "'$&") : 'Date not available'}
                    </p>
                </div>
                <div className="m-auto">
                    <p className="text-black font-bold">
                        Fly with Air India from {departurePlace} to {destination}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default FlightSummary