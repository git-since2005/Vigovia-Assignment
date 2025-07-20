import React, { useState } from 'react'

function ActivityTable(props) {
  const index = props.number
  const activities = props.activities || []
  const setActivities = props.setActivities
  const availableDates = props.availableDates || []
  const activity = activities[index] || {}
  const { name = '', description = '', price = '', date = '', time = '' } = activity

  const handleChange = (field, value) => {
    const updated = [...activities]
    updated[index] = { ...updated[index], [field]: value }
    setActivities(updated)
    console.log(updated[index])
  }

  const inputs = [
    {
      label: "Activity Name",
      type: "text",
      placeholder: "Enter activity name",
      value: name,
      onChange: (e) => handleChange('name', e.target.value),
      readOnly: false,
      disabled: false
    },
    {
      label: "Description",
      type: "text",
      placeholder: "Enter activity description",
      value: description,
      onChange: (e) => handleChange('description', e.target.value),
      readOnly: false,
      disabled: false
    },
    {
      label: "Price",
      type: "number",
      placeholder: "Enter price",
      value: price,
      onChange: (e) => handleChange('price', e.target.value),
      readOnly: false,
      disabled: false
    },
  ];

  return (
    <div className="flex flex-col border-2 border-[#321E5D] shadow-xl rounded-2xl p-6 mx-auto mt-8 w-4/5 bg-white">
      <h1 className="text-2xl text-[#541C9C] mb-4">Activity Details #{index + 1}</h1>
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
      <div className="flex flex-col mb-3">
        <label className="text-lg text-[#321E5D] mb-1">Date</label>
        <select
          className="ring ring-[#321E5D] outline-none p-2 rounded-lg"
          value={date}
          onChange={(e) => handleChange('date', e.target.value)}
        >
          <option value="">Select a date</option>
          {availableDates.map((dateOption, idx) => (
            <option key={idx} value={dateOption}>
              {dateOption}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col mb-3">
        <label className="text-lg text-[#321E5D] mb-1">Time</label>
                  <input
            className="ring ring-[#321E5D] outline-none p-2 rounded-lg"
            type="time"
            placeholder="Select time"
            value={time}
            onChange={(e) => handleChange('time', e.target.value)}
          />
      </div>
    </div>
  )
}

export default ActivityTable
