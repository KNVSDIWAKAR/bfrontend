import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const filterOptions = [
    { value: "alphabets", label: "Alphabets" },
    { value: "numbers", label: "Numbers" },
    {
      value: "highest_lowercase_alphabet",
      label: "Highest Lowercase Alphabet",
    },
  ];

  useEffect(() => {
    document.title = "21BIT0734";
  }, []);

  const handleSubmit = async () => {
    try {
      const parsedData = JSON.parse(jsonInput);

      if (!parsedData.data) {
        throw new Error("Invalid JSON format");
      }

      setErrorMessage("");
      const res = await axios.post(
        "https://dbackend-finalram.vercel.app/bfhl",
        parsedData
      );
      setResponseData(res.data);
    } catch (err) {
      setErrorMessage(
        err.message === 'Invalid JSON format. Missing "data" key.'
          ? err.message
          : "Invalid JSON format or server error."
      );
      setResponseData(null);
    }
  };

  const handleSelectChange = (options) => {
    setSelectedOptions(options);
  };

  const renderFilteredResponse = () => {
    if (!responseData) return null;

    let filteredResponse = {};
    selectedOptions.forEach((option) => {
      filteredResponse[option.value] = responseData[option.value];
    });

    return (
      <div className="response-card">
        <h3>Filtered Response:</h3>
        <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="app-container">
      <h1>21BIT0734</h1>
      <div className="form-group">
        <textarea
          className="json-input"
          placeholder="Enter JSON input"
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
        />
        <button className="submit-btn" onClick={handleSubmit}>
          Submit
        </button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>

      {responseData && (
        <>
          <div className="form-group">
            <Select
              isMulti
              value={selectedOptions}
              onChange={handleSelectChange}
              options={filterOptions}
              className="multi-select"
              classNamePrefix="select"
            />
          </div>
          {renderFilteredResponse()}
        </>
      )}
    </div>
  );
}

export default App;
