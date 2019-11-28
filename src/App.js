import React, { useState, useEffect } from 'react';
// import _ from 'lodash';
import { ChartView, Sidebar } from './components';

import './App.css';

const csvURL = 'http://adverity-challenge.s3-website-eu-west-1.amazonaws.com/DAMKBAoDBwoDBAkOBAYFCw.csv';

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
        const result = await fetch(csvURL);
        const csvToText = await result.text();
        csvToJSON(csvToText);
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

  // Creates arrays with unique values and filters out (null, undefined, 0, false, '')
  const createUniqueFilterArrays = (array = []) => array.map(filter => {
      // https://dev.to/clairecodes/how-to-create-an-array-of-unique-values-in-javascript-using-sets-5dg6
      return [ ...new Set(filter)]
        .filter(Boolean)
        .map(name => ({
            active: true,
            name,
          }));
    });

  const setCampaignFilter = (filter) => {
    console.log("set the filters for", filter);
  }

  const setDatasourceFilter = (filter) => {
    console.log("set the filters for", filter);
  }

  // Loop through the data and get a SUM of
  // Clicks & Impressions collected by common Date
  // Returns array of objects ordered by Date
  const collectMetricsByDate = (data) => {
    if (data.length === 0) {
      return;
    }

    const dateArray = data.map(d => d.Date);
    const uniqueDates = [ ...new Set(dateArray)];

    const filteredMetrics = uniqueDates.map(date => {
      const singleDayMetrics = data.filter(d => d.Date === date);
      // The '+' operator is a quick way to convert string -> number
      const Clicks = singleDayMetrics.reduce((a, b) => a + +b.Clicks, 0);
      const Impressions = singleDayMetrics.reduce((a, b) => a + +b.Impressions, 0);

      // https://stackoverflow.com/a/33299764
      const dateParts = date.split(".");
      const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

      return {
        Clicks,
        Date: dateObject,
        Impressions,
      };
    }).filter(fm => (!isNaN(fm.Clicks)) || (!isNaN(fm.Impressions)));
    // Potentially add sort by Date here if needed

    setFilteredData(filteredMetrics);
  }

  return (
    <div className="App">
      <Sidebar
        activeCampaignFilters={activeCampaignFilters}
        activeDatasourceFilters={activeDatasourceFilters}
        campaignFilterOptions={campaignFilterOptions}
        datasourceFilterOptions={datasourceFilterOptions}
        setCampaignFilter={setActiveCampaignFilters}
        setDatasourceFilter={setActiveDatasourceFilters}
      />
      <ChartView data={filteredData} />
    </div>
  );
}

export default App;
