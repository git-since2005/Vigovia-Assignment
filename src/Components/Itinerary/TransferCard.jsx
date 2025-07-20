import React, { useContext } from 'react'
import place from '../../assets/place.jpg'
import { appContext } from '../../contexts/main'

function TransferCard(props) {
    const { transfers, activitiesList } = useContext(appContext)

    // Get activities and transfers for this specific date
    const dayActivities = activitiesList ? activitiesList.filter(a => a.date === props.date) : []
    const dayTransfers = transfers ? transfers.filter(t => t.date === props.date) : []

    // Determine if this is an arrival day based on whether there are transfers for this date
    const isArrivalDay = dayTransfers.length > 0

    return (
        <div className='h-60 w-auto flex'>
            <div className="bg-[#321E5D] w-fit h-full rounded-xl flex">
                <p style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }} className='text-white text-2xl m-auto'>Day {props.day}</p>
            </div>
            <div className="flex p-4">
                <div className="flex flex-col">
                    <img src={place} className='rounded-full h-30 w-30 m-auto' />
                    <p className='font-bold text-center '>
                        {props.date ? new Date(props.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' }) : ''}
                    </p>
                    <p className='text-sm w-40 text-center'>
                        {isArrivalDay ? `Arrival in ${props.from} & city Exploration` : `City Exploration in ${props.from}`}
                    </p>
                </div>
                                {/* Timeline */}
                <div className="timeline w-1 bg-[#2F80ED] ml-10 h-full relative">
                    {/* Morning Arrival */}
                    <Circle 
                        time="09:00"
                        activities={[isArrivalDay ? `Arrive in ${props.from}` : `Start exploring ${props.from}`]}
                    />
                    
                    {/* Transfers */}
                    {dayTransfers.map((transfer, index) => (
                        <Circle 
                            key={`transfer-${index}`}
                            time={transfer.time}
                            activities={[`${transfer.type} from ${transfer.from} to ${transfer.to}`]}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

function Circle(props) {
    return (
        <div className='flex items-center w-full mb-4'>
            <div className="p-1 -ml-[2px] bg-white h-1 w-1 border border-[#321E5D] rounded-full flex-shrink-0"></div>
            <p className='text-bold ml-3 flex-shrink-0'>{props.time}</p>
            <div className='flex flex-wrap ml-4 flex-1'>
                {
                    props.activities.map((activity, index) => (
                        <li key={index} className='text-sm mr-4 w-100 mb-1 px-2 py-1 rounded'>
                            {activity}
                        </li>
                    ))
                }
            </div>
        </div>
    )
}

export default TransferCard