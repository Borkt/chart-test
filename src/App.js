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
  return (
    <div className="App">
      <Sidebar />

      <ChartView />
    </div>
  );
}

export default App;
