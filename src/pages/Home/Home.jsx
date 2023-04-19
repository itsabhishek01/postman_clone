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
  };

  return (
    <div>
      <ul>
        {tabs.map((tab) => (
          <li key={tab.id}>
            <i onClick={() => setActiveTab(tab.id)}>
              {
                <i
                  style={{
                    borderBottom: activeTab === tab.id && "4px solid white",
                    marginLeft: "8px",
                  }}
                >{`Tab ${tab.id}`}</i>
              }
              {tab.id !== 1 && (
                <i
                  class="fa fa-trash delete"
                  onClick={() => closeTab(tab.id)}
                ></i>
              )}
            </i>
          </li>
        ))}
        <li>
          <button onClick={addTab}>New Tab</button>
        </li>
      </ul>
      {/* mapping tabs */}
      {tabs.map((tab, _) => (
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
