import React, { useState } from "react";
import { UrlBox } from "../../components";

export default function Home() {
  //Tabs
  const [tabs, setTabs] = useState([{ id: 1 }]);
  const [activeTab, setActiveTab] = useState(0);

  //Add tab functionlity
  const addTab = () => {
    const newTab = { id: tabs.length + 1 };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
  };

  //Close tab functionality
  const closeTab = (tabId) => {
    const newupdateTab = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newupdateTab);
    if (activeTab === tabId) {
      setActiveTab(newupdateTab.length > 0 ? newupdateTab[0].id : null);
      // setData(data);
    }
  };

  return (
    <div>
      <h3>Check Your API</h3>

      <ul>
        {tabs.map((tab) => (
          <li key={tab.id}>
            <i
              onClick={() => setActiveTab(tab.id)}
              style={{ cursor: "pointer" }}
            >
              {activeTab === 0 && "Create a New Tab"}
              {activeTab !== 0 && (
                <i
                  style={{
                    borderBottom: activeTab === tab.id && "4px solid white",marginLeft:'8px'
                  }}
                >{`Tab ${tab.id}`}</i>
              )}
              {tab.id !== 1 && (
                <button
                  onClick={() => closeTab(tab.id)}
                  style={{ backgroundColor: "red" }}
                >
                  Delete
                </button>
              )}
            </i>
          </li>
        ))}
        <li>
          {activeTab !== 0 && <button
            onClick={addTab}
            style={{ backgroundColor: "black", cursor: "pointer" }}
          >
            New TAB
          </button>}
        </li>
      </ul>

      {tabs.map((tab, index) => (
        <div
          key={index}
          className={index + 1 === activeTab ? "tab-active" : "tab"}
        >
          <UrlBox />
        </div>
      ))}
    </div>
  );
}
