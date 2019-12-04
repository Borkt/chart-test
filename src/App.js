import React, { useState, useEffect } from 'react';
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

  // This Effect runs once when the component mounts. It fetches remote CSV data,
  // converts it to an array and saves mockData and FilterOptions to local state
  useEffect(() => {
    const setFilterOptions = (data) => {
      const datasources = data.map(d => d.Datasource);
      const campaigns = data.map(d => d.Campaign);

      const uniqueCampaigns = createUniqueArrays(campaigns).map(convertToChartFormat);
      const uniqueDatasources = createUniqueArrays(datasources).map(convertToChartFormat);

      setCampaignFilterOptions(uniqueCampaigns);
      setDatasourceFilterOptions(uniqueDatasources);
    }

    // Standard method for javascript CSV text to JSON conversion
    // Adapted from: http://techslides.com/convert-csv-to-json-in-javascript
    const csvTextToJSON = (csv) => {
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

      setMockData(result);
      setFilterOptions(result);
    }

    const fetchData = async () => {
      try {
        const result = await fetch(csvURL);
        const csvToText = await result.text();
        csvTextToJSON(csvToText);
      } catch (e) {
        console.log("fetchData error:", e);
      }
    };

    fetchData();
  }, []);

  // This Effect runs when mockData, activeDatasourceFilters or activeCampaignFilters
  // are updated. It is kept separate from the 'onMount' Effect above
  useEffect(() => {
    // Loop through data and get a SUM of Clicks & Impressions
    // *Collected and Ordered by Common Date*
    // Returns an array of arrays with format required by
    // 'react-timeseries-charts' TimeSeries class
    const filterDataAndAggregateByDate = (data = mockData) => {
      if (data.length === 0) {
        return;
      }

      // The next two conditional blocks produce an 'AND' effect
      // For simplicity I did not include more complex 'AND / OR' logic
      if (activeDatasourceFilters.length > 0) {
        const dataFilters = activeDatasourceFilters.map(f => f.value);
        data = data.filter(d => dataFilters.includes(d.Datasource));
      }

      if (activeCampaignFilters.length > 0) {
        const campaignFilters = activeCampaignFilters.map(f => f.value);
        data = data.filter(d => campaignFilters.includes(d.Campaign));
      }

      const dateArray = data.map(d => d.Date);
      const uniqueDates = createUniqueArrays(dateArray);

      const filteredMetrics = uniqueDates.map(date => {
        const singleDayMetrics = data.filter(d => d.Date === date);

        // The '+' operator is a quick way to convert string -> number
        const Clicks = singleDayMetrics.reduce((a, b) => a + +b.Clicks, 0);
        const Impressions = singleDayMetrics.reduce((a, b) => a + +b.Impressions, 0);

        // Date reformating required for 'react-timeseries-charts'
        // https://stackoverflow.com/a/33299764
        const dateParts = date.split(".");
        const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

        return [
          dateObject,
          Clicks,
          Impressions,
        ];
      }) // Potentially add sort by Date here if needed

      setFilteredData(filteredMetrics);
    }

    filterDataAndAggregateByDate();
  }, [mockData, activeDatasourceFilters, activeCampaignFilters])

  // Creates arrays with unique values and filters out (null, undefined, 0, false, '')
  const createUniqueArrays = (array) => [ ...new Set(array)].filter(Boolean)

  // Outputs data format required for 'react-timeseries-charts'
  const convertToChartFormat = (label) => ({ label, value: label })

  const setCampaignFilter = (filter) => {
    setActiveCampaignFilters(filter || []);
  }

  const setDatasourceFilter = (filter) => {
    setActiveDatasourceFilters(filter || []);
  }

  return (
    <div className="App">
      <Sidebar
        activeCampaignFilters={activeCampaignFilters}
        activeDatasourceFilters={activeDatasourceFilters}
        campaignFilterOptions={campaignFilterOptions}
        datasourceFilterOptions={datasourceFilterOptions}
        setCampaignFilter={setCampaignFilter}
        setDatasourceFilter={setDatasourceFilter}
      />
      <ChartView
        activeCampaignFilters={activeCampaignFilters}
        activeDatasourceFilters={activeDatasourceFilters}
        data={filteredData} />
    </div>
  );
}

export default App;
