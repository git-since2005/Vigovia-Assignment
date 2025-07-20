import React, { useRef, useContext, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { appContext } from '../contexts/main';
import Logo from '../assets/Logo.png';
import Footer from '../assets/Footer.png';
import LastFooter from '../assets/Last Footer.png';
import TransferCard from './Itinerary/TransferCard';
import FlightSummary from './Itinerary/FlightSummary';
import HotelBookings from './Itinerary/HotelBookings';
import PaymentPlan from './Itinerary/PaymentPlan';

function GenerateItineraryPDF() {
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef();
  const { destination, transfers, activitiesList, numberOfTravellers, departurePlace, travelerName, numberOfDays } = useContext(appContext);

  // Calculate statistics
  const numberOfTransfers = transfers ? transfers.filter(t => t.from && t.to && t.type && t.time && t.date).length : 0;
  const numberOfActivities = activitiesList ? activitiesList.filter(a => a.name && a.description && a.price && a.date && a.time).length : 0;

  // Get departure and arrival dates
  const validTransfers = transfers ? transfers.filter(t => t.from && t.to && t.type && t.time && t.date) : [];
  const validActivities = activitiesList ? activitiesList.filter(a => a.name && a.description && a.price && a.date && a.time) : [];

  const departureDate = validTransfers.length > 0 ? validTransfers[0].date : '';
  const arrivalDate = validActivities.length > 0 ? validActivities[validActivities.length - 1].date : '';

  // Group activities by date
  const activitiesByDate = {};
  validActivities.forEach(activity => {
    if (!activitiesByDate[activity.date]) {
      activitiesByDate[activity.date] = [];
    }
    activitiesByDate[activity.date].push(activity);
  });

  // Group transfers by date
  const transfersByDate = {};
  validTransfers.forEach(transfer => {
    if (!transfersByDate[transfer.date]) {
      transfersByDate[transfer.date] = [];
    }
    transfersByDate[transfer.date].push(transfer);
  });

  // Get all unique dates and sort them
  const allDates = [...new Set([...Object.keys(activitiesByDate), ...Object.keys(transfersByDate)])].sort();

  // Calculate nights based on date range
  const calculateNights = () => {
    if (allDates.length < 2) return 0;

    const startDate = new Date(allDates[0]);
    const endDate = new Date(allDates[allDates.length - 1]);

    // Calculate difference in milliseconds and convert to days
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff;
  };

  const numberOfNights = calculateNights();

  const handlePreview = () => {
    setShowPreview(!showPreview);
  };

  const handleDownload = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Get all the CSS styles from the current page
    const styles = Array.from(document.styleSheets)
      .map(sheet => {
        try {
          return Array.from(sheet.cssRules || sheet.rules || [])
            .map(rule => rule.cssText)
            .join('\n');
        } catch (e) {
          return '';
        }
      })
      .join('\n');
    
    // Get the exact same content from the preview
    const pdfContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${travelerName || 'Itinerary'}_${destination || 'Trip'}</title>
          <style>
            ${styles}
            @media print {
              body { margin: 0; padding: 0; }
              .pdf-content { 
                width: 100%; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px;
                font-family: Arial, sans-serif;
                color: #222;
                background: white;
              }
              .no-print { display: none !important; }
            }
            @media screen {
              body { 
                background: #f0f0f0; 
                margin: 0; 
                padding: 20px; 
                font-family: Arial, sans-serif;
              }
              .pdf-content { 
                width: 100%; 
                max-width: 800px; 
                margin: 0 auto; 
                padding: 20px;
                background: white;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
                border-radius: 8px;
              }
            }
            .print-button { 
              position: fixed; 
              top: 20px; 
              right: 20px; 
              background: #936FE0; 
              color: white; 
              border: none; 
              padding: 12px 24px; 
              border-radius: 8px; 
              cursor: pointer; 
              font-size: 16px; 
              z-index: 1000; 
            }
            .print-button:hover { background: #680099; }
          </style>
        </head>
        <body>
          <button class="print-button no-print" onclick="window.print()">Print/Save as PDF</button>
          <div class="pdf-content">
            <div class="w-[800px] bg-white text-[#222] p-8">
              <!-- Header with Logo -->
              <div class="flex flex-col items-center mb-8 border-b-2 border-[#321E5D] pb-4 text-center">
                <img src="${Logo}" alt="Vigovia Logo" class="h-20 mb-4" />
              </div>

              <!-- Gradient Welcome Box -->
              <div class="bg-gradient-to-r from-[#4BA1EB] to-[#936FE0] p-8 rounded-xl mb-8 text-white text-center">
                <h2 class="text-[1.8rem] mb-2 font-bold">
                  Hi, ${travelerName || 'Passenger'}
                </h2>
                <h3 class="text-[1.5rem] mb-2 font-semibold">
                  ${destination} Itinerary
                </h3>
                <p class="text-[1.2rem] opacity-90">
                  ${numberOfDays} Days and ${numberOfDays - 1} Nights
                </p>
              </div>

              <!-- Trip Details Box -->
              <div class="border-2 border-[#541C9C] p-1 rounded-lg mb-8 bg-gray-50">
                <div class="flex gap-1">
                  <div class="p-2 flex flex-col">
                    <strong>Departure From</strong> ${departurePlace}
                  </div>
                  <div class="p-2 flex flex-col">
                    <strong>Departure</strong> ${departureDate}
                  </div>
                  <div class="p-2 flex flex-col">
                    <strong>Arrival</strong> ${arrivalDate}
                  </div>
                  <div class="p-2 flex flex-col">
                    <strong>Destination</strong> ${destination}
                  </div>
                  <div class="p-2 flex flex-col">
                    <strong>Number of Travellers</strong> ${numberOfTravellers}
                  </div>
                </div>
              </div>

              <!-- Daily Itinerary with TransferCard -->
              ${allDates.map((date, dayIndex) => {
                const transfersForDate = validTransfers.filter(t => t.date === date);
                const fromLocation = transfersForDate.length > 0 ? transfersForDate[0].from : destination;
                
                return `
                  <div class="mb-6">
                    <div class="border-2 border-[#321E5D] rounded-xl overflow-hidden">
                      <div class="bg-[#321E5D] text-white p-4 font-bold">
                        Day ${dayIndex + 1} - ${date}
                      </div>
                      <div class="p-4">
                        <p><strong>From:</strong> ${fromLocation}</p>
                        <p><strong>To:</strong> ${destination}</p>
                        <p><strong>Transfer Type:</strong> Flight</p>
                        <p><strong>Time:</strong> ${transfersForDate.length > 0 ? transfersForDate[0].time : 'TBD'}</p>
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}

              <div class="border-t border-gray-300 my-4"></div>

              <!-- Flight Summary -->
              <h3 class="text-lg font-bold mb-3">Flight <span class="text-[#680099]">Summary</span></h3>
              ${validTransfers.map((transfer, index) => `
                <div class="mb-2">
                  <p><strong>Date:</strong> ${transfer.date}</p>
                  <p><strong>From:</strong> ${transfer.from}</p>
                  <p><strong>To:</strong> ${transfer.to}</p>
                  <p><strong>Time:</strong> ${transfer.time}</p>
                </div>
              `).join('')}
              <p class="text-sm text-gray-500">Note: All flights include meals, seat choice (excluding XL), and 20kg/25Kg checked baggage.</p>
              
              <div class="border-t border-gray-300 my-4"></div>
              
              <!-- Hotel Bookings -->
              <h3 class="text-xl font-bold mb-3">Hotel <span class="text-[#680099]">Bookings</span></h3>
              <p>Hotel bookings will be confirmed based on availability and your preferences.</p>
              <ul class="list-decimal list-inside text-sm text-gray-700 space-y-1">
                <li>All hotels are tentative and may be replaced with similar alternatives.</li>
                <li>Breakfast is included for all hotel stays.</li>
                <li>A maximum occupancy of 2 people per room is allowed in most hotels.</li>
                <li>All hotels will be 4-star category or above.</li>
              </ul>

              <!-- Important Notes -->
              <div class="mb-6 mt-4">
                <h3 class="text-xl font-bold mb-3">Important <span class="text-[#680099]">Notes</span></h3>
                
                <table class="w-full border-separate border-spacing-x-1 border-spacing-y-0">
                  <thead>
                    <tr>
                      <th class="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Points</th>
                      <th class="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-0">
                      <td class="bg-pink-50 p-3 pb-4 text-sm">Airlines Standard Policy</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm">In case of visa rejection, visa fees or any other non cancellable component cannot be reimbursed at any cost.</td>
                    </tr>
                    <tr class="border-0">
                      <td class="bg-pink-50 p-3 pb-4 text-sm">Flight/Hotel Cancellation</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm">In case of visa rejection, visa fees or any other non cancellable component cannot be reimbursed at any cost.</td>
                    </tr>
                    <tr class="border-0">
                      <td class="bg-pink-50 p-3 pb-4 text-sm">Trip Insurance</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm">In case of visa rejection, visa fees or any other non cancellable component cannot be reimbursed at any cost.</td>
                    </tr>
                    <tr class="border-0">
                      <td class="bg-pink-50 p-3 pb-4 text-sm">Hotel Check-In & Check Out</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm">In case of visa rejection, visa fees or any other non cancellable component cannot be reimbursed at any cost.</td>
                    </tr>
                    <tr class="border-0">
                      <td class="bg-pink-50 p-3 pb-4 text-sm rounded-b-3xl">Visa Rejection</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm rounded-b-3xl">In case of visa rejection, visa fees or any other non cancellable component cannot be reimbursed at any cost.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Scope of Service -->
              <div class="mb-6 mt-4">
                <h3 class="text-xl font-bold mb-3">Scope of <span class="text-[#680099]">Service</span></h3>
                
                <table class="w-full border-separate border-spacing-x-1 border-spacing-y-0">
                  <thead>
                    <tr>
                      <th class="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Service</th>
                      <th class="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-0">
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Flight tickets and hotel vouchers</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Flight tickets and hotel vouchers</td>
                    </tr>
                    <tr class="border-0">
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Web Check-In</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Web Check-In</td>
                    </tr>
                    <tr class="border-0">
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Support</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Support</td>
                    </tr>
                    <tr class="border-0">
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Cancellation Support</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Cancellation Support</td>
                    </tr>
                    <tr class="border-0">
                      <td class="bg-pink-50 p-3 pb-4 text-sm rounded-b-3xl text-center">Trip Support</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm rounded-b-3xl text-center">Trip Support</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Inclusion Summary -->
              <div class="mb-6 mt-4">
                <h3 class="text-xl font-bold mb-3">Inclusion <span class="text-[#680099]">Summary</span></h3>
                
                <table class="w-full border-separate border-spacing-x-1 border-spacing-y-0">
                  <thead>
                    <tr>
                      <th class="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Category</th>
                      <th class="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Count</th>
                      <th class="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Details</th>
                      <th class="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl">Status/Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-0">
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Flights</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">${validTransfers.length}</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">All flights mentioned</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Confirmed</td>
                    </tr>
                    <tr class="border-0">
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Hotels</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">${validTransfers.filter(t => t.to && t.date).length}</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Airport to Hotel - Hotel to Attractions - Day trips if any</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Awaiting Confirmation</td>
                    </tr>
                    <tr class="border-0">
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center rounded-b-3xl">Tourist Tax</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center rounded-b-3xl">${validTransfers.length}</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center rounded-b-3xl">Yotel (Singapore), Oakwood (Sydney), Mercure (Cairns), Novotel (Gold Coast), Holiday Inn (Melbourne)</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center rounded-b-3xl">Included</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="border-t border-gray-300 my-4"></div>

              <!-- Transfer Policy -->
              <div class="mt-4 mb-6">
                <p class="text-xs text-black">
                  <span class="font-bold">Transfer Policy (Refundable Upon Claim)</span><br />
                  If any transfer is delayed beyond 15 minutes, customers may book an app-based or radio taxi and claim a refund for that specific leg.
                </p>
              </div>

              <!-- Activity Table -->
              <div class="mb-6 mt-4">
                <h3 class="text-xl font-bold mb-3">Activity <span class="text-[#680099]">Summary</span></h3>
                
                <table class="w-full border-separate border-spacing-x-1 border-spacing-y-0">
                  <thead>
                    <tr>
                      <th class="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">City</th>
                      <th class="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Activity</th>
                      <th class="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Date/Time</th>
                      <th class="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl">Time Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${validActivities.map((activity, index) => `
                      <tr class="border-0">
                        <td class="bg-pink-50 p-3 pb-4 text-sm text-center ${index === validActivities.length - 1 ? 'rounded-b-3xl' : ''}">${activity.city || destination}</td>
                        <td class="bg-pink-50 p-3 pb-4 text-sm text-center ${index === validActivities.length - 1 ? 'rounded-b-3xl' : ''}">${activity.name}</td>
                        <td class="bg-pink-50 p-3 pb-4 text-sm text-center ${index === validActivities.length - 1 ? 'rounded-b-3xl' : ''}">${activity.date && activity.time ? `${activity.date} ${activity.time}` : 'Airlines Standard'}</td>
                        <td class="bg-pink-50 p-3 pb-4 text-sm text-center ${index === validActivities.length - 1 ? 'rounded-b-3xl' : ''}">${activity.duration || '2-3 hours'}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>

              <!-- Terms and Conditions -->
              <div class="mb-6 mt-4">
                <h3 class="text-xl font-bold mb-3">Terms and <span class="text-[#680099]">Conditions</span></h3>
                <div class="text-center mt-4">
                  <a href="#" class="text-[#680099] underline text-sm">View terms and conditions</a>
                </div>
              </div>

              <!-- Payment Plan -->
              <div class="mb-6 mt-4">
                <h3 class="text-xl font-bold mb-3">Payment <span class="text-[#680099]">Plan</span></h3>
                
                <!-- Payment Summary Rows -->
                <div class="mb-4">
                  <div class="flex border-2 border-[#541C9C] rounded-lg mb-2">
                    <div class="bg-pink-100 p-3 w-fit border-r-2 border-[#541C9C] rounded-tl-lg rounded-bl-lg rounded-tr-[1.25rem] rounded-br-[1.25rem] relative">
                      <p class="font-semibold w-45 text-black">Total Amount</p>
                    </div>
                    <div class="m-auto">
                      <p class="text-black font-bold">₹100,000</p>
                    </div>
                  </div>
                  
                  <div class="flex border-2 border-[#541C9C] rounded-lg">
                    <div class="bg-pink-100 p-3 w-fit border-r-2 border-[#541C9C] rounded-tl-lg rounded-bl-lg rounded-tr-[1.25rem] rounded-br-[1.25rem] relative">
                      <p class="font-semibold w-45 text-black">TCS (5%)</p>
                    </div>
                    <div class="m-auto">
                      <p class="text-black font-bold">₹5,000</p>
                    </div>
                  </div>
                </div>
                
                <!-- Payment Table -->
                <table class="w-full border-separate border-spacing-x-1 border-spacing-y-0">
                  <thead>
                    <tr>
                      <th class="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Payment Stage</th>
                      <th class="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Amount</th>
                      <th class="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Due Date</th>
                      <th class="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-0">
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Booking Confirmation</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">₹25,000</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Immediate</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Paid</td>
                    </tr>
                    <tr class="border-0">
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Before Travel</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">₹50,000</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">7 days before</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center">Pending</td>
                    </tr>
                    <tr class="border-0">
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center rounded-b-3xl">On Arrival</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center rounded-b-3xl">₹25,000</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center rounded-b-3xl">At destination</td>
                      <td class="bg-pink-50 p-3 pb-4 text-sm text-center rounded-b-3xl">Pending</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Footer -->
              <div class="mt-8">
                <img src="${Footer}" alt="Footer" class="w-full h-auto" />
              </div>
            </div>
          </div>
          <script>
            // Auto-trigger print after a short delay
            setTimeout(() => {
              window.print();
            }, 500);
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(pdfContent);
    printWindow.document.close();
  };

  // PDF Content Component for Preview
  const PDFContent = () => (
    <div className="w-[800px] bg-white text-[#222] p-8">
      {/* Header with Logo */}
      <div className="flex flex-col items-center mb-8 border-b-2 border-[#321E5D] pb-4 text-center">
        <img src={Logo} alt="Vigovia Logo" className="h-20 mb-4" />
      </div>

      {/* Gradient Welcome Box */}
      <div className="bg-gradient-to-r from-[#4BA1EB] to-[#936FE0] p-8 rounded-xl mb-8 text-white text-center">
        <h2 className="text-[1.8rem] mb-2 font-bold">
          Hi, {travelerName || 'Passenger'}
        </h2>
        <h3 className="text-[1.5rem] mb-2 font-semibold">
          {destination} Itinerary
        </h3>
        <p className="text-[1.2rem] opacity-90">
          {numberOfDays} Days and {numberOfDays - 1} Nights
        </p>
      </div>

      {/* Trip Details Box */}
      <div className="border-2 border-[#541C9C] p-1 rounded-lg mb-8 bg-gray-50">
        <div className="flex gap-1">
          <div className="p-2 flex flex-col">
            <strong>Departure From</strong> {departurePlace}
          </div>
          <div className="p-2 flex flex-col">
            <strong>Departure</strong> {departureDate}
          </div>
          <div className="p-2 flex flex-col">
            <strong>Arrival</strong> {arrivalDate}
          </div>
          <div className="p-2 flex flex-col">
            <strong>Destination</strong> {destination}
          </div>
          <div className="p-2 flex flex-col">
            <strong>Number of Travellers</strong> {numberOfTravellers}
          </div>
        </div>
      </div>

      {/* Daily Itinerary with TransferCard */}
      {allDates.map((date, dayIndex) => {
        // Find transfers for this specific date
        const transfersForDate = validTransfers.filter(t => t.date === date);
        // Use the first transfer's 'from' location for this date, or destination if no transfers
        const fromLocation = transfersForDate.length > 0 ? transfersForDate[0].from : destination;
        
        return (
          <div key={date} className="mb-6">
            <TransferCard
              day={dayIndex + 1}
              date={date}
              from={fromLocation}
            />
          </div>
        );
      })}

      <div className="border-t border-gray-300 my-4"></div>

      {/* Flight Summary - After all TransferCards */}
      <h3 className=" text-lg font-bold mb-3">Flight <span className='text-[#680099]'>Summary</span></h3>
      {validTransfers.map((transfer, index) => (
        <div key={index} className="mb-2">
          <FlightSummary departureDate={transfer.date} />
        </div>
      ))}
      <p className='text-sm text-gray-500'>Note: All flights include meals, seat choice (excluding XL), and 20kg/25Kg checked  baggage.</p>
      
      <div className="border-t border-gray-300 my-4"></div>
      
      {/* Hotel Bookings */}
      <HotelBookings transfers={validTransfers} />
      <div className="mt-1 mb-4">
        <ul className="list-decimal list-inside text-sm text-gray-700 space-y-1">
          <li>All hotels are tentative and may be replaced with similar alternatives.</li>
          <li>Breakfast is included for all hotel stays.</li>
          <li>A maximum occupancy of 2 people per room is allowed in most hotels.</li>
          <li>All hotels will be 4-star category or above.</li>
        </ul>
      </div>

      {/* Important Notes */}
      <div className="mb-6 mt-4">
        <h3 className="text-xl font-bold mb-3">Important <span className='text-[#680099]'>Notes</span></h3>
        
        <table className="w-full border-separate border-spacing-x-1 border-spacing-y-0">
          <thead>
            <tr>
              <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Points</th>
              <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-0">
              <td className="bg-pink-50 p-3 pb-4 text-sm ">Airlines Standard Policy</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm">In case of visa rejection, visa fees or any other non cancellable component cannot be reimbursed at any cost.</td>
            </tr>
            <tr className="border-0">
              <td className="bg-pink-50 p-3 pb-4 text-sm ">Flight/Hotel Cancellation</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm">In case of visa rejection, visa fees or any other non cancellable component cannot be reimbursed at any cost.</td>
            </tr>
            <tr className="border-0">
              <td className="bg-pink-50 p-3 pb-4 text-sm ">Trip Insurance</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm">In case of visa rejection, visa fees or any other non cancellable component cannot be reimbursed at any cost.</td>
            </tr>
            <tr className="border-0">
              <td className="bg-pink-50 p-3 pb-4 text-sm ">Hotel Check-In & Check Out</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm">In case of visa rejection, visa fees or any other non cancellable component cannot be reimbursed at any cost.</td>
            </tr>
            <tr className="border-0">
              <td className="bg-pink-50 p-3 pb-4 text-sm  rounded-b-3xl">Visa Rejection</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm rounded-b-3xl">In case of visa rejection, visa fees or any other non cancellable component cannot be reimbursed at any cost.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Scope of Service */}
      <div className="mb-6 mt-4">
        <h3 className="text-xl font-bold mb-3">Scope of <span className='text-[#680099]'>Service</span></h3>
        
        <table className="w-full border-separate border-spacing-x-1 border-spacing-y-0">
          <thead>
            <tr>
              <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Service</th>
              <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-0">
              <td className="bg-pink-50 p-3 pb-4 text-sm  text-center">Flight tickets and hotel vouchers</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm text-center">Flight tickets and hotel vouchers</td>
            </tr>
            <tr className="border-0">
              <td className="bg-pink-50 p-3 pb-4 text-sm  text-center">Web Check-In</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm text-center">Web Check-In</td>
            </tr>
            <tr className="border-0">
              <td className="bg-pink-50 p-3 pb-4 text-sm  text-center">Support</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm text-center">Support</td>
            </tr>
            <tr className="border-0">
              <td className="bg-pink-50 p-3 pb-4 text-sm  text-center">Cancellation Support</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm text-center">Cancellation Support</td>
            </tr>
            <tr className="border-0">
              <td className="bg-pink-50 p-3 pb-4 text-sm  rounded-b-3xl text-center">Trip Support</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm rounded-b-3xl text-center">Trip Support</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Inclusion Summary */}
      <div className="mb-6 mt-4">
        <h3 className="text-xl font-bold mb-3">Inclusion <span className='text-[#680099]'>Summary</span></h3>
        
        <table className="w-full border-separate border-spacing-x-1 border-spacing-y-0">
          <thead>
            <tr>
              <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Category</th>
              <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Count</th>
              <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Details</th>
              <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl">Status/Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-0">
              <td className="bg-pink-50 p-3 pb-4 text-sm  text-center">Flights</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm  text-center">{validTransfers.length}</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm  text-center">All flights mentioned</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm text-center">Confirmed</td>
            </tr>
            <tr className="border-0">
              <td className="bg-pink-50 p-3 pb-4 text-sm  text-center">Hotels</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm  text-center">{validTransfers.filter(t => t.to && t.date).length}</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm  text-center">Airport to Hotel - Hotel to Attractions - Day trips if any</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm text-center">Awaiting Confirmation</td>
            </tr>
            <tr className="border-0">
              <td className="bg-pink-50 p-3 pb-4 text-sm  text-center rounded-b-3xl">Tourist Tax</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm  text-center rounded-b-3xl">{validTransfers.length}</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm  text-center rounded-b-3xl">Yotel (Singapore), Oakwood (Sydney), Mercure (Cairns), Novotel (Gold Coast), Holiday Inn (Melbourne)</td>
              <td className="bg-pink-50 p-3 pb-4 text-sm text-center rounded-b-3xl">Included</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-300 my-4"></div>

      {/* Transfer Policy */}
      <div className="mt-4 mb-6">
        <p className="text-xs text-black">
          <span className="font-bold">Transfer Policy (Refundable Upon Claim)</span><br />
          If any transfer is delayed beyond 15 minutes, customers may book an app-based or radio taxi and claim a refund for that specific leg.
        </p>
      </div>

      {/* Activity Table */}
      <div className="mb-6 mt-4">
        <h3 className="text-xl font-bold mb-3">Activity <span className='text-[#680099]'>Summary</span></h3>
        
        <table className="w-full border-separate border-spacing-x-1 border-spacing-y-0">
          <thead>
            <tr>
              <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">City</th>
              <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Activity</th>
              <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl border-r border-white">Date/Time</th>
              <th className="bg-[#321E5D] text-white font-bold text-sm p-3 rounded-t-3xl">Time Required</th>
            </tr>
          </thead>
          <tbody>
            {validActivities.map((activity, index) => (
              <tr key={index} className="border-0">
                <td className={`bg-pink-50 p-3 pb-4 text-sm  text-center ${index === validActivities.length - 1 ? 'rounded-b-3xl' : ''}`}>
                  {activity.city || destination}
                </td>
                <td className={`bg-pink-50 p-3 pb-4 text-sm  text-center ${index === validActivities.length - 1 ? 'rounded-b-3xl' : ''}`}>
                  {activity.name}
                </td>
                <td className={`bg-pink-50 p-3 pb-4 text-sm  text-center ${index === validActivities.length - 1 ? 'rounded-b-3xl' : ''}`}>
                  {activity.date && activity.time ? `${activity.date} ${activity.time}` : 'Airlines Standard'}
                </td>
                <td className={`bg-pink-50 p-3 pb-4 text-sm text-center ${index === validActivities.length - 1 ? 'rounded-b-3xl' : ''}`}>
                  {activity.duration || '2-3 hours'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-6 mt-4">
        <h3 className="text-xl font-bold mb-3">Terms and <span className='text-[#680099]'>Conditions</span></h3>
        <div className="text-center mt-4">
          <a href="#" className="text-[#680099] underline text-sm">View terms and conditions</a>
        </div>
      </div>

      {/* Payment Plan */}
      <PaymentPlan />

      {/* Footer */}
      <div className="mt-8">
        <img src={Footer} alt="Footer" className="w-full h-auto" />
      </div>
    </div>
  );

  return (
    <div className="mt-8">
      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-5">
          <div className="bg-white rounded-xl max-w-[90vw] max-h-[90vh] overflow-auto relative">
            {/* Header with buttons */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-3 flex justify-between items-center z-20">
              <button
                onClick={handleDownload}
                className="bg-[#936FE0] text-white px-6 py-2 rounded-lg hover:bg-[#680099] transition-all duration-300 font-medium"
              >
                Download PDF
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="bg-gray-500 text-white border-none rounded-full w-8 h-8 text-lg cursor-pointer hover:bg-gray-600 transition-all duration-300"
              >
                ×
              </button>
            </div>
            
            <div ref={previewRef} className="p-5">
              <PDFContent />
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handlePreview}
          className="bg-[#936FE0] text-white px-6 py-2 rounded hover:bg-[#680099] transition-all duration-300"
        >
          Preview Itinerary
        </button>
        <button
          onClick={handleDownload}
          className="bg-[#936FE0] text-white px-6 py-2 rounded hover:bg-[#680099] transition-all duration-300"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default GenerateItineraryPDF;