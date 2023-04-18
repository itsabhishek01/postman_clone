import React, { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

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

  //state for api data
  const [apiData, setApiData] = useState({
    data: {},
  });

  //validation state
  const [isValid, setIsValid] = useState(true);

  //handle the change in body
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

  //handle the change in header
  const handleChangeHeader = (e) => {
    setUrlStates((prevState) => ({
      ...prevState,
      header: e.target.value,
    }));
  };

  //handling change in query Params

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
  
  //api get data function
  const getAPI_Data = (url) => {
    axios
      .get(url, { headers: JSON.parse(urlStates.header) })
      .then((res) => setApiData((prevState) => ({ ...prevState, data: res })))
      .catch((_) =>
        setApiData((prevState) => ({
          ...prevState,
          data: {
            data: {
              data: ["Not A Valid API"],
            },
          },
        }))
      );
  };

  //api post data function
  const postAPI_data = (url, body) => {
    axios
      .post(url, JSON.parse(body), { headers: JSON.parse(urlStates.header) })
      .then((res) => setApiData((prevState) => ({ ...prevState, data: res })))
      .catch((error) =>
        setApiData((prevState) => ({
          ...prevState,
          data: {
            data: {
              data: ["Not A Valid API"],
            },
          },
        }))
      );
  };

  //PI SWLW
  const deleteAPI_data = (url, id) => {
    axios
      .delete(`${url}/${id}`, { headers: JSON.parse(urlStates.header) })
      .then((res) => setApiData((prevState) => ({ ...prevState, data: res })))
      .catch((error) =>
        setApiData((prevState) => ({
          ...prevState,
          data: {
            data: {
              data: ["Not A Valid API"],
            },
          },
        }))
      );
  };

  const putAPI_data = (url, id, body) => {
    axios
      .put(`${url}/${id}`, JSON.parse(body))
      .then((res) => setApiData((prevState) => ({ ...prevState, data: res })))
      .catch((error) =>
        setApiData((prevState) => ({
          ...prevState,
          data: {
            data: {
              data: ["Not A Valid API"],
            },
          },
        }))
      );
  };

  const formSubmission = (e) => {
    e.preventDefault();
    if (urlStates.key !== "" && urlStates.value !== "") {
      axios
        .get(urlStates.URL, {
          headers: JSON.parse(urlStates.header),
        })
        .then((res) => setApiData((prevState) => ({ ...prevState, data: res })))
        .catch((_) =>
          setApiData((prevState) => ({
            ...prevState,
            data: {
              data: {
                data: ["Not A Valid API"],
              },
            },
          }))
        );
    }

    if (urlStates.userSelection === "GET") {
      getAPI_Data(urlStates.URL);
    }

    if (urlStates.userSelection === "POST") {
      postAPI_data(urlStates.URL, urlStates.body);
    }
    if (urlStates.userSelection === "DELETE") {
      deleteAPI_data(urlStates.URL, urlStates.body);
    }
    if (urlStates.userSelection === "PUT") {
      putAPI_data(urlStates.URL, urlStates.id, urlStates.body);
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
            setUrlStates((prevState) => ({ ...prevState, URL: e.target.value }))
          }
        />
        <button>DONE</button>
        {apiData.data.status && <i>Status Code: {apiData.data.status}</i>}
        {apiData.data.status === 201 && <i>POSTED SUCCESSFULLY</i>}
        {apiData.data.statusText && (
          <i> , Status Text : {apiData.data.statusText} </i>
        )}
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
            value={JSON.stringify(apiData.data.data, null, 2)}
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
