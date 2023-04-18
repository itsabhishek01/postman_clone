import React, { useState } from "react";

function Tabs() {
  const [tabs, setTabs] = useState([
    {
      urlStates: {
        userSelection: "GET",
        URL: undefined,
        body: {},
        id: undefined,
        header: JSON.stringify({
          "content-type": "application/json",
        }),
        key: "",
        value: "",
      },
      apiData: {
        data: {},
      },
      isValid: true,
    },
  ]);

  return (
    <div>
      {tabs.map((tab, index) => (
        <button key={index} onClick={() => setActiveTab(index)}>
          Tab {index + 1}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
