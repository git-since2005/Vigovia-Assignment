import React, { useContext, useEffect } from 'react'
import { appContext } from "../../contexts/main"

function TransferTable(props) {
  const { destination, departurePlace } = useContext(appContext)
  const index = props.number
  const transfers = props.transfers || []
  const setTransfers = props.setTransfers
  const transfer = transfers[index] || {}
  const { from = '', to = '', type = '', time = '', date = '' } = transfer

  // Get the previous transfer's "To" value to use as current "From"
  const getPreviousToValue = () => {
    if (index === 0) {
      return destination // First transfer starts from destination
    }
    const previousTransfer = transfers[index - 1]
    return previousTransfer ? previousTransfer.to : ''
  }

  useEffect(() => {
    if (index === 0) {
      const updated = [...transfers]
      updated[0] = { 
        ...updated[0], 
        from: destination,
        to: updated[0]?.to || '' // Preserve existing "To" value if it exists
      }
      setTransfers(updated)
    } else {
      // For subsequent transfers, set "From" to previous transfer's "To"
      const previousToValue = getPreviousToValue()
      if (previousToValue && from !== previousToValue) {
        const updated = [...transfers]
        updated[index] = { 
          ...updated[index], 
          from: previousToValue
        }
        setTransfers(updated)
      }
    }
  }, [destination, index])

  const handleChange = (field, value) => {
    const updated = [...transfers]
    updated[index] = { ...updated[index], [field]: value }
    
    // Keep "From" field synchronized with previous transfer's "To"
    if (index === 0) {
      updated[0].from = destination // Keep "From" as destination for first transfer
    } else if (field === 'to') {
      // When "To" field changes, update next transfer's "From" field
      const nextTransferIndex = index + 1
      if (nextTransferIndex < transfers.length) {
        updated[nextTransferIndex] = { 
          ...updated[nextTransferIndex], 
          from: value 
        }
      }
    }
    
    setTransfers(updated)
    console.log(updated[index])
  }

  const inputs = [
    {
      label: "From",
      type: "text",
      placeholder: "Boarding",
      value: index === 0 ? destination : from,
      onChange: index === 0 ? () => {} : (e) => handleChange('from', e.target.value),
      readOnly: index === 0,
      disabled: index === 0
    },
    {
      label: "To",
      type: "text",
      placeholder: "Departing",
      value: to,
      onChange: (e) => handleChange('to', e.target.value),
      readOnly: false,
      disabled: false
    },    
    {
      label: "Type",
      type: "text",
      placeholder: "Type",
      value: type,
      onChange: (e) => handleChange('type', e.target.value),
      readOnly: false,
      disabled: false
    },
    {
      label: "Date",
      type: "date",
      placeholder: "Date",
      value: date,
      onChange: (e) => handleChange('date', e.target.value),
      readOnly: false,
      disabled: false
    },
    {
      label: "Time",
      type: "time",
      placeholder: "Time",
      value: time,
      onChange: (e) => handleChange('time', e.target.value),
      readOnly: false,
      disabled: false
    },
  ];

  return (
    <div className="flex flex-col border-2 border-[#321E5D] shadow-xl rounded-lg p-6 mx-auto mt-8 w-4/5 bg-white">
      <h1 className="text-2xl text-[#541C9C] mb-4">
        {index === 0 ? "First Transfer (From Destination)" : `Transfer ${index + 1}`}
      </h1>
      {inputs.map((input, idx) => (
        <div className="flex flex-col mb-3" key={idx}>
          <label className="text-lg text-[#321E5D] mb-1">{input.label}</label>
          <input
            className="ring ring-[#321E5D] outline-none p-2 rounded-lg"
            type={input.type}
            placeholder={input.placeholder}
            value={input.value}
            onChange={input.onChange}
            readOnly={input.readOnly}
            disabled={input.disabled}
          />
        </div>
      ))}
    </div>
  )
}

export default TransferTable
