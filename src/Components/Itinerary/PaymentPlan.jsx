import React from 'react'

function PaymentPlan() {
    const totalAmount = 100000 // 1 lakh in rupees
    const tcs = totalAmount * 0.05 // 5% TCS
    
    return (
        <div className="mb-6 mt-4">
            <h3 className="text-xl font-bold mb-3">Payment <span className='text-[#680099]'>Plan</span></h3>
            
            {/* Payment Summary Rows */}
            <div className="mb-4">
                <div className="flex border-2 border-[#541C9C] rounded-lg mb-2">
                    <div className="bg-pink-100 p-3 w-fit border-r-2 border-[#541C9C] rounded-tl-lg rounded-bl-lg rounded-tr-[1.25rem] rounded-br-[1.25rem] relative">
                        <p className="font-semibold w-45 text-black">Total Amount</p>
                    </div>
                    <div className="m-auto">
                        <p className="text-black font-bold">₹{totalAmount.toLocaleString()}</p>
                    </div>
                </div>
                
                <div className="flex border-2 border-[#541C9C] rounded-lg">
                    <div className="bg-pink-100 p-3 w-fit border-r-2 border-[#541C9C] rounded-tl-lg rounded-bl-lg rounded-tr-[1.25rem] rounded-br-[1.25rem] relative">
                        <p className="font-semibold w-45 text-black">TCS (5%)</p>
                    </div>
                    <div className="m-auto">
                        <p className="text-black font-bold">₹{tcs.toLocaleString()}</p>
                    </div>
                </div>
            </div>
            
            {/* Payment Table */}
            <table className="w-full border-separate border-spacing-x-1 border-spacing-y-0">
                <thead>
                    <tr>
                        <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Payment Stage</th>
                        <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Amount</th>
                        <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Due Date</th>
                        <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-0">
                        <td className="bg-pink-50 p-3 pb-4 text-sm  text-center">Booking Confirmation</td>
                        <td className="bg-pink-50 p-3 pb-4 text-sm  text-center">₹25,000</td>
                        <td className="bg-pink-50 p-3 pb-4 text-sm  text-center">Immediate</td>
                        <td className="bg-pink-50 p-3 pb-4 text-sm text-center">Paid</td>
                    </tr>
                    <tr className="border-0">
                        <td className="bg-pink-50 p-3 pb-4 text-sm  text-center">Before Travel</td>
                        <td className="bg-pink-50 p-3 pb-4 text-sm  text-center">₹50,000</td>
                        <td className="bg-pink-50 p-3 pb-4 text-sm  text-center">7 days before</td>
                        <td className="bg-pink-50 p-3 pb-4 text-sm text-center">Pending</td>
                    </tr>
                    <tr className="border-0">
                        <td className="bg-pink-50 p-3 pb-4 text-sm  text-center rounded-b-3xl">On Arrival</td>
                        <td className="bg-pink-50 p-3 pb-4 text-sm  text-center rounded-b-3xl">₹25,000</td>
                        <td className="bg-pink-50 p-3 pb-4 text-sm  text-center rounded-b-3xl">At destination</td>
                        <td className="bg-pink-50 p-3 pb-4 text-sm text-center rounded-b-3xl">Pending</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default PaymentPlan 