import React, { useState, useEffect } from 'react';
// import _ from 'lodash';
import { ChartView, Sidebar } from './components';

import './App.css';

const s3URL = 'http://adverity-challenge.s3-website-eu-west-1.amazonaws.com/DAMKBAoDBwoDBAkOBAYFCw.csv';

const App = () => {
  const [mockData, setMockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [campaignFilterOptions, setCampaignFilterOptions] = useState([]);
  const [datasourceFilterOptions, setDatasourceFilterOptions] = useState([]);

  const [activeCampaignFilters, setActiveCampaignFilters] = useState([]);
  const [activeDatasourceFilters, setActiveDatasourceFilters] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(s3URL);
        const toText = await result.text();
        csvToJSON(toText);
      } catch (e) {
        console.log("fetchData error:", e);
      }
    };

    fetchData();
  }, []);

  // Adapted from:  http://techslides.com/convert-csv-to-json-in-javascript
  const csvToJSON = (csv) => {
    const lines = csv.split("\n");
    const headers = lines[0].split(",");

    const result = lines.map((line, i) => {
      if (i === 0) {
        return null;
      }

      const obj = {};
      const currentline = lines[i].split(",");
      headers.forEach((header, i) => obj[headers[i]] = currentline[i]);
      return obj;

    }).filter(r => (r !== null) && (r.Date.length > 0));

    // console.log("resultz", result);

    setMockData(result);
    collectMetricsByDate(result);
    setFilterOptions(result);
  }

  const setFilterOptions = (data) => {
    // console.log("setFilterOptions", data.length);
    const datasources = data.map(d => d.Datasource);
    const campaigns = data.map(d => d.Campaign);

    const [uniqueCampaigns, uniqueDatasources] = createUniqueFilterArrays([campaigns, datasources]);

    setCampaignFilterOptions(uniqueCampaigns);
    setDatasourceFilterOptions(uniqueDatasources);
  }

  return (
    <div className="App">
      <Sidebar />

      <ChartView />
    </div>
  );
}

export default App;
