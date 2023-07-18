import React, { useState } from "react";
import "./App.css";
import StackedBarChart from "./StackedBarChart";

const allKeys = ["completed", "pending"];

const colors = {
  "completed": "green",
  "pending": "orange",
};

function Appa({data}) {
  console.log('Appa:',data)
  const [keys, setKeys] = useState(allKeys);
  return (
    <div id="rootx">
      <h2>Bar Chart with D3 </h2>
      <StackedBarChart data={data} keys={keys} colors={colors} />

      <div className="fields">
        {allKeys.map(key => (
          <div key={key} className="field">
            <input
              id={key}
              type="checkbox"
              checked={keys.includes(key)}
              onChange={e => {
                if (e.target.checked) {
                  setKeys(Array.from(new Set([...keys, key])));
                } else {
                  setKeys(keys.filter(_key => _key !== key));
                }
              }}
            />
            <label htmlFor={key} style={{ color: colors[key] }}>
              {key}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Appa;