import React, { useState, useEffect } from 'react';
import { ChartView, Sidebar } from './components';

import './App.css';

const csvURL = 'http://adverity-challenge.s3-website-eu-west-1.amazonaws.com/DAMKBAoDBwoDBAkOBAYFCw.csv';

const App = () => {
  const [mockData, setMockData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [filterOptions, setFilterOptions] = useState({
    campaignFilters: [],
    datasourceFilters: [],
  });

  const [activeFilterOptions, setActiveFilterOptions] = useState({
    activeCampaignFilters: [],
    activeDatasourceFilters: [],
  });

  // Runs: Once when App component mounts
  // Updates: mockData, campaignFilterOptions & datasourceFilterOptions
  useEffect(() => {
    const setMockDataAndFilterOptions = (data) => {
      const datasources = [];
      const campaigns = [];

      data.forEach(d => {
        datasources.push(d.Datasource);
        campaigns.push(d.Campaign);
      });

      const campaignFilters = createUniqueArray(campaigns).map(convertToChartFormat);
      const datasourceFilters = createUniqueArray(datasources).map(convertToChartFormat);

      setFilterOptions(state => ({ ...state, campaignFilters, datasourceFilters }));
      setMockData(data);
    }

    // Adapted from: http://techslides.com/convert-csv-to-json-in-javascript
    const csvTextToJSON = (csv) => {
      const lines = csv.split('\n');
      const headers = lines[0].split(',');

      const result = lines.map((line, i) => {
        if (i === 0) {
          return null;
        }

        const obj = {};
        const currentline = lines[i].split(',');
        headers.forEach((header, i) => obj[headers[i]] = currentline[i]);
        return obj;

      }).filter(r => (r !== null) && (r.Date.length > 0));

      setMockDataAndFilterOptions(result);
    }

    const fetchData = async () => {
      try {
        const result = await fetch(csvURL);
        const csvToText = await result.text();
        csvTextToJSON(csvToText);
      } catch (e) {
        console.log('fetchData error:', e);
      }
    };

    fetchData();
  }, []);


  // Runs: when mockData, activeDatasourceFilters, or activeCampaignFilters changes
  // Updates: filteredData
  useEffect(() => {
    // Loop through data and get a SUM of Clicks & Impressions
    // **Collected and Ordered by Common Date**
    // Returns an array of arrays formated for 'react-timeseries-charts'
    const filterDataAndAggregateByDate = (data) => {
      if (data.length === 0) {
        return;
      }

      const { activeDatasourceFilters,  activeCampaignFilters } = activeFilterOptions;

      // Filter the data by active Datasource and Campaign
      // The next lines produce an 'AND' effect. For simplicity I did not
      // include more complex 'AND / OR' logic
      if (activeDatasourceFilters.length > 0) {
        const dataFilters = activeDatasourceFilters.map(f => f.value);
        data = data.filter(d => dataFilters.includes(d.Datasource));
      }

      if (activeCampaignFilters.length > 0) {
        const campaignFilters = activeCampaignFilters.map(f => f.value);
        data = data.filter(d => campaignFilters.includes(d.Campaign));
      }

      const dateArray = data.map(d => d.Date);
      const uniqueDates = createUniqueArray(dateArray);

      // Aggregate data by common Date and return in necessary format
      const filteredMetrics = uniqueDates.map(date => {
        const dateAggregatedMetrics = data.filter(d => d.Date === date);

        // The '+' operator is a quick way to convert string -> number
        const Clicks = dateAggregatedMetrics.reduce((a, b) => a + +b.Clicks, 0);
        const Impressions = dateAggregatedMetrics.reduce((a, b) => a + +b.Impressions, 0);

        // Date reformating required for 'react-timeseries-charts'
        // https://stackoverflow.com/a/33299764
        const dateParts = date.split('.');
        const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

        return [dateObject, Clicks, Impressions];
      });

      setFilteredData(filteredMetrics);
    }

    filterDataAndAggregateByDate(mockData);
  }, [mockData, activeFilterOptions])

  // Creates arrays with unique values and filters out (null, undefined, 0, false, '')
  const createUniqueArray = (array) => [ ...new Set(array)].filter(Boolean)

  // Outputs data format required for 'react-timeseries-charts'
  const convertToChartFormat = (label) => ({ label, value: label })

  const setActiveFilter = (e, filterType) => {
    setActiveFilterOptions(state => ({ ...state, [filterType]: e || [] }));
  }

  return (
    <div className='App'>
      <Sidebar
        activeFilterOptions={activeFilterOptions}
        filterOptions={filterOptions}
        setActiveFilter={setActiveFilter}
      />
      <ChartView
        activeFilterOptions={activeFilterOptions}
        data={filteredData} />
    </div>
  );
}

export default App;
