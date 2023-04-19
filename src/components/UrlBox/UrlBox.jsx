import React, { useState } from "react";
import { axiosInstance } from "../../Services";
import { useEffect } from "react";
import { CircularProgress } from "@mui/material";

function UrlBox() {
  //states fot the url , and api
  const [urlStates, setUrlStates] = useState({
    userSelection: "GET",
    URL: "",
    body: {},
    id: undefined,
    key: "",
    value: "",
  });
  const [apiData, setApiData] = useState({});
  const [apiError, setApiError] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [loading, setLoading] = useState(false);

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

  const handleIDChange = (e) =>
    setUrlStates((prevState) => ({
      ...prevState,
      id: e.target.value,
    }));

  const handleURLChange = (e) =>
    setUrlStates((prevState) => ({
      ...prevState,
      URL: e.target.value,
    }));

  useEffect(() => {
    if (urlStates.URL !== "") {
      const newURL = new URL(urlStates.URL);
      const searchParams = newURL.searchParams;
      searchParams.forEach((_, keyOfParam) => {
        if (keyOfParam !== urlStates.key) {
          searchParams.delete(keyOfParam);
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

  const sendAPIData = async (method, url, data) => {
    try {
      setLoading(true);
      const response = await axiosInstance({
        method,
        url,
        data,
      });
      setApiData(response.data);
      setLoading(false);
      setApiError("")
    } catch (error) {
      setLoading(false);
      setApiError(error.message);
      setApiData({})
    }
  };

  const formSubmission = async (e) => {
    e.preventDefault();
    try {
      switch (urlStates.userSelection) {
        case "GET":
          sendAPIData("GET", urlStates.URL);
          break;
        case "POST":
          sendAPIData("POST", urlStates.URL, JSON.parse(urlStates.body));
          break;
        case "DELETE":
          sendAPIData("DELETE", `${urlStates.URL}/${urlStates.id}`);
          break;
        case "PUT":
          sendAPIData("PUT",`${urlStates.URL}/${urlStates.id}`,JSON.parse(urlStates.body));
          break;
        default:
          sendAPIData("GET", urlStates.URL);
          break;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={formSubmission}>
        <select
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
        <input type="url" value={urlStates.URL} onChange={handleURLChange} />
        <button>DONE</button>
      </form>
      {apiError}
      <div className="responsePart">
        <span>
          {urlStates.userSelection === "PUT" ||
          urlStates.userSelection === "DELETE" ? (
            <div>
              <div>
                <i>ID</i>
              </div>
              <input
                type="text"
                placeholder="id"
                onChange={handleIDChange}
                id="inputBelow"
              />
            </div>
          ) : (
            ""
          )}
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
        </span>
        <span>
          <div>
            <i>Query Parms</i>
          </div>
          <input
            className="queryInpt"
            type="text"
            placeholder="key"
            onChange={handleChangekey}
          />
          <input
            className="queryInpt"
            type="text"
            placeholder="value"
            onChange={handleChangevalue}
          />
        </span>

        <span>
          {loading && (
            <div className="loader">
              <CircularProgress />
            </div>
          )}
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
