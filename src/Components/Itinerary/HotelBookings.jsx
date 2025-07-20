import React, { useContext } from 'react'
import { appContext } from '../../contexts/main'

function HotelBookings({ transfers }) {
    const { destination } = useContext(appContext)
    
    // Calculate hotel bookings based on transfers
    const hotelBookings = transfers ? transfers.map((transfer, index) => {
        const checkIn = transfer.date
        const checkOut = transfers[index + 1] ? transfers[index + 1].date : transfer.date
        
        // Calculate nights between check-in and check-out
        const calculateNights = (checkIn, checkOut) => {
            if (!checkIn || !checkOut) return 0
            const startDate = new Date(checkIn)
            const endDate = new Date(checkOut)
            const timeDiff = endDate.getTime() - startDate.getTime()
            const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))
            return Math.max(0, daysDiff)
        }
        
        const nights = calculateNights(checkIn, checkOut)
        
        return {
            city: transfer.to || destination,
            checkIn: checkIn,
            checkOut: checkOut,
            nights: nights,
            hotelName: "Super TownHouse Oak"
        }
    }).filter(booking => booking.nights > 0) : []
    
    return (
        <div className="mb-6 mt-4">
            <h3 className=" text-xl font-bold mb-3">Hotel <span className='text-[#680099]'>Bookings</span></h3>
            
            <table className="w-full border-separate border-spacing-x-1 border-spacing-y-0">
                <thead>
                    <tr>
                        <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">City</th>
                        <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Check In</th>
                        <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Check Out</th>
                        <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Nights</th>
                        <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl">Hotel Name</th>
                    </tr>
                </thead>
                <tbody>
                    {hotelBookings.map((booking, index) => (
                        <tr key={index} className="border-0">
                            <td className={`bg-pink-50 p-3 pb-4 text-sm ${index === hotelBookings.length - 1 ? 'rounded-b-3xl' : ''}`}>{booking.city}</td>
                            <td className={`bg-pink-50 p-3 pb-4 text-sm ${index === hotelBookings.length - 1 ? 'rounded-b-3xl' : ''}`}>{booking.checkIn}</td>
                            <td className={`bg-pink-50 p-3 pb-4 text-sm ${index === hotelBookings.length - 1 ? 'rounded-b-3xl' : ''}`}>{booking.checkOut}</td>
                            <td className={`bg-pink-50 p-3 pb-4 text-sm ${index === hotelBookings.length - 1 ? 'rounded-b-3xl' : ''}`}>{booking.nights}</td>
                            <td className={`bg-pink-50 p-3 pb-4 text-sm ${index === hotelBookings.length - 1 ? 'rounded-b-3xl' : ''}`}>{booking.hotelName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default HotelBookings 