import React from 'react'

const AvailableOptionsList = ({ options, onItemClick }) => {
  console.log("options:", options)
  if (options === null || Object.keys(options).length === 0) {
    return (<div>No options are available in this poll</div>)
  }

  return (
    <ul className="Vote-options">
      {Object.keys(options).map((key, index) => (
        <li key={`item-${index}`} onClick={() => {
          let value = options[key]
          value["id"] = key
          onItemClick(value)
        }}>
          <h3>{options[key].title}</h3>
          {options[key].desc}
        </li>
      ))}
    </ul>
  );
};

export default AvailableOptionsList;