import React, { useState, useEffect } from 'react';
import { useFetchApi } from './custom-hooks/useFetchApi';
import { useAggregateData } from './custom-hooks/useAggregateData';

import { ChartView, Sidebar } from './components';

import './App.css';

const url = 'http://adverity-challenge.s3-website-eu-west-1.amazonaws.com/DAMKBAoDBwoDBAkOBAYFCw.csv';

const App = () => {

  const [mockData, setMockData] = useState([]);

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
    console.log("API fetch error", error);
  }

  // Runs: when response changes
  // Updates: mockData and filterOptions
  useEffect(() => {
    if (!response) {
      return;
    }

    const datasources = [];
    const campaigns = [];

    response.forEach(d => {
      datasources.push(d.Datasource);
      campaigns.push(d.Campaign);
    });

    const campaignFilters = createUniqueArray(campaigns).map(convertToChartFormat);
    const datasourceFilters = createUniqueArray(datasources).map(convertToChartFormat);

    // useReducer() might be an improvement here
    setMockData(response);
    setFilterOptions(state => ({ ...state, campaignFilters, datasourceFilters }));
  }, [response]);

  const { filteredData } = useAggregateData(mockData, activeFilterOptions);

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
