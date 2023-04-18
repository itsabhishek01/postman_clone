import React, { useState } from "react";
import UrlBox from "../../components/UrlBox/UrlBox";
export default function Tabs() {
  const [tabs, setTabs] = useState([{ id: 1 }]);
  const [activeTab, setActiveTab] = useState(1);
  const [maxId, setMaxId] = useState(1);
  
  const addTab = () => {
    const newTab = { id: maxId + 1 };
    setTabs([...tabs, newTab]);
    setActiveTab(newTab.id);
    setMaxId(newTab.id);
  };
  const closeTab = (tabId) => {
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);
    if (activeTab === tabId) {
      setActiveTab(newTabs.length > 0 ? newTabs[0].id : null);
    }
  };
  return (
    <div className="tabs-container">
      <ul>
        {tabs.map((tab) => (
          <li key={tab.id}>
            <a
              className={`tab-link ${
                tab.id === activeTab ? "tab-link-active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {(
                <i
                  style={{
                    borderBottom: activeTab === tab.id && "4px solid white",
                    marginLeft: "8px",
                  }}
                >{`Tab ${tab.id}`}</i>
              )}
              {tab.id !== 1 && (
                <i class="fa fa-trash" onClick={() => closeTab(tab.id)} style={{marginLeft:'8px',cursor:'pointer'}}>
                </i>
              )}
            </a>
          </li>
        ))}
        <li>
          <button className="tab-add" onClick={addTab}>
            New Tab
          </button>
        </li>
      </ul>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          className={tab.id === activeTab ? "tab-active" : "tab"}
        >
          <UrlBox />
        </div>
      ))}
    </div>
  );
}









