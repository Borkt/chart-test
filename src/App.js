import React, { useState, useEffect } from 'react';
import { useFetchApi } from './useDataApi';

import { ChartView, Sidebar } from './components';

import './App.css';

const url = 'http://adverity-challenge.s3-website-eu-west-1.amazonaws.com/DAMKBAoDBwoDBAkOBAYFCw.csv';

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

  // Creates arrays with unique values and filters out (null, undefined, 0, false, '')
  const createUniqueArray = (array) => [ ...new Set(array)].filter(Boolean);

  // Outputs data format required for 'react-timeseries-charts'
  const convertToChartFormat = (label) => ({ label, value: label });

  const { response, error } = useFetchApi({ url, csvFetch: true });

  if (error) {
    console.log("fetch error", error);
  }

  useEffect(() => {
    if (!response) {
      return;
    }

    setMockData(response);

    const datasources = [];
    const campaigns = [];

    response.forEach(d => {
      datasources.push(d.Datasource);
      campaigns.push(d.Campaign);
    });

    const campaignFilters = createUniqueArray(campaigns).map(convertToChartFormat);
    const datasourceFilters = createUniqueArray(datasources).map(convertToChartFormat);

    setFilterOptions(state => ({ ...state, campaignFilters, datasourceFilters }));
  }, [response]);

  // Runs: when mockData, activeDatasourceFilters, or activeCampaignFilters changes
  // Updates: filteredData
  useEffect(() => {

    const preFilterData = (data) => {
      // Filter the data by active Datasource and Campaign
      // The next lines produce an 'AND' effect.
      const { activeDatasourceFilters,  activeCampaignFilters } = activeFilterOptions;
      if (activeDatasourceFilters.length > 0) {
        const dataFilters = activeDatasourceFilters.map(f => f.value);
        data = data.filter(d => dataFilters.includes(d.Datasource));
      }

      if (activeCampaignFilters.length > 0) {
        const campaignFilters = activeCampaignFilters.map(f => f.value);
        data = data.filter(d => campaignFilters.includes(d.Campaign));
      }

      return data;
    }

    // Loop through data and get a SUM of Clicks & Impressions
    // **Collected and Ordered by Common Date**
    // Returns an array of arrays formated for 'react-timeseries-charts'
    const filterDataAndAggregateByDate = (data) => {
      if (data.length === 0) {
        return;
      }

      const filteredData = preFilterData(data);

      const dateArray = filteredData.map(d => d.Date);
      const uniqueDates = createUniqueArray(dateArray);

      // Aggregate data by common Date and return required Chart format
      const filteredMetrics = uniqueDates.map(date => {
        const dateAggregatedMetrics = filteredData.filter(d => d.Date === date);

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
  }, [mockData, activeFilterOptions]);

  const setActiveFilter = (filter, filterType) => {
    setActiveFilterOptions({ ...activeFilterOptions, [filterType]: filter || [] });
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
