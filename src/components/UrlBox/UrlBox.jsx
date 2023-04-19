import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { axiosInstance } from "../../Services";

function UrlBox() {
  //states fot the url , and api
  const [urlStates, setUrlStates] = useState({
    userSelection: "GET",
    URL: "",
    body: {},
    id: undefined,
    header: JSON.stringify({
      "content-type": "application/json",
    }),
    key: "",
    value: "",
  });

  const [apiData, setApiData] = useState({});

  const [isValid, setIsValid] = useState(true);

  const handleBodyChange = (e) => {
    setUrlStates((prevState) => ({
      ...prevState,
      body: e.target.value,
    }));
    try {
      JSON.parse(urlStates.body);
      setIsValid(true);
    } catch (error) {
      setIsValid(false);
    }
  };

  const handleChangeHeader = (e) => {
    setUrlStates((prevState) => ({
      ...prevState,
      header: e.target.value,
    }));
  };

  const handleChangekey = (e) => {
    setUrlStates((prevState) => ({
      ...prevState,
      key: e.target.value,
    }));
  };

  const handleChangevalue = (e) => {
    setUrlStates((prevState) => ({
      ...prevState,
      value: e.target.value,
    }));
  };

  useEffect(() => {
    if (urlStates.URL !== "") {
      const newURL = new URL(urlStates.URL);
      const searchParams = newURL.searchParams;
      searchParams.forEach((_, paramKey) => {
        if (paramKey !== urlStates.key) {
          searchParams.delete(paramKey);
        }
      });
      if (urlStates.value || urlStates.key) {
        newURL.searchParams.set(urlStates.key, urlStates.value);
      } else {
        newURL.searchParams.delete(urlStates.key, urlStates.value);
      }
      setUrlStates((prevState) => ({
        ...prevState,
        URL: newURL,
      }));
    }
  }, [urlStates.key, urlStates.value]);

  const formSubmission = async (e) => {
    e.preventDefault();
    try {
      let response;
      switch (urlStates.userSelection) {
        case "GET":
          response = await axiosInstance.get(urlStates.URL);
          break;
        case "POST":
          response = await axiosInstance.post(urlStates.URL, JSON.parse(urlStates.body));
          break;
        case "DELETE":
          response = await axiosInstance.delete(`${urlStates.URL}/${urlStates.id}`, {
            body: JSON.parse(urlStates.body),
          });
          break;
        case "PUT":
          response = await axiosInstance.put(`${urlStates.URL}/${urlStates.id}`, {
            body: JSON.parse(urlStates.body),
          });
          break;
        default:
          response = await axiosInstance.get(urlStates.URL);
          break;
      }
      setApiData(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  axios.interceptors.request.use((req) => {
    document.getElementById("loading").style.display = "block";
    return req;
  });

  axios.interceptors.response.use((req) => {
    document.getElementById("loading").style.display = "none";
    return req;
  });

  return (
    <div>
      <form onSubmit={formSubmission}>
        <select
          name=""
          id=""
          onChange={(e) =>
            setUrlStates((prevState) => ({
              ...prevState,
              userSelection: e.target.value,
            }))
          }
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="DELETE">DELETE</option>
          <option value="PUT">PUT</option>
        </select>
        <input
          type="url"
          name=""
          id=""
          value={urlStates.URL}
          onChange={(e) =>
            setUrlStates((prevState) => ({
              ...prevState,
              URL: e.target.value,
            }))
          }
        />
        <button>DONE</button>
      </form>
      <div className="responsePart">
        <span>
          <div>
            <i>HEADER</i>
          </div>
          <div>
            <textarea
              cols="65"
              rows="12"
              placeholder="Enter the Header"
              value={urlStates.header}
              onChange={handleChangeHeader}
            ></textarea>
          </div>
          {urlStates.userSelection === "POST" && (
            <div>
              <div>
                <i>BODY</i>
              </div>
              <textarea
                cols="65"
                rows="16"
                placeholder="Enter the Body"
                onChange={handleBodyChange}
              />
              {!isValid && <div className="error">Invalid JSON format.</div>}
              {isValid && <div className="valid">JSON is valid.</div>}
            </div>
          )}

          {urlStates.userSelection === "DELETE" && (
            <div>
              <div>
                <i>BODY</i>
              </div>
              <textarea
                cols="65"
                rows="16"
                placeholder="Enter the Body"
                onChange={handleBodyChange}
              />
              {!isValid && <div className="error">Invalid JSON format.</div>}
              {isValid && <div className="valid">JSON is valid.</div>}
            </div>
          )}

          {urlStates.userSelection === "PUT" && (
            <div>
              <div>
                <div>
                  <i>ID</i>
                </div>
                <input
                  type="text"
                  placeholder="id"
                  onChange={(e) =>
                    setUrlStates((prevState) => ({
                      ...prevState,
                      id: e.target.value,
                    }))
                  }
                  id="inputBelow"
                />
              </div>
              <div>
                <i>BODY</i>
              </div>
              <textarea
                cols="65"
                rows="12"
                placeholder="Enter the Body"
                onChange={handleBodyChange}
              />
              {!isValid && <div className="error">Invalid JSON format.</div>}
              {isValid && <div className="valid">JSON is valid.</div>}
            </div>
          )}
        </span>
        <span>
          <div>
            <i>Query Parms</i>
          </div>
          <input
            className="queryInpt"
            type="text"
            name=""
            id=""
            placeholder="key"
            onChange={handleChangekey}
          />
          <input
            className="queryInpt"
            type="text"
            name=""
            id=""
            placeholder="value"
            onChange={handleChangevalue}
          />
        </span>

        <span>
          <div>
            <i>RESPONSE</i>
          </div>

          <textarea
            id="json"
            value={JSON.stringify(apiData, null, 2)}
            cols="65"
            rows="32"
            readOnly
          />
        </span>
      </div>
    </div>
  );
}

export default UrlBox;
