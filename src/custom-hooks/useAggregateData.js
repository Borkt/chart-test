import { useEffect, useState } from 'react';

// Main Business logic here. Filtering & Aggregating data real-time on Client
export const useAggregateData = (mockData, activeFilterOptions) => {
  const [filteredData, setFilteredData] = useState([]);

  // Creates arrays with unique values and filters out (null, undefined, 0, false, '')
  const createUniqueArray = (array) => [ ...new Set(array)].filter(Boolean);

  // Runs: when preFilteredData changes
  // Updates: filteredData
  useEffect(() => {
    // Potential optimization -> implement useMemo()

    // Loop through data & get a SUM of Clicks & Impressions
    // **Collected and Ordered by Common Date**
    // Returns an array of arrays formated for 'react-timeseries-charts'
    const filterDataAndAggregateByDate = (data) => {
      if (data.length === 0) {
        return;
      }

      const preFilterData = (data) => {

        const { activeDatasourceFilters, activeCampaignFilters } = activeFilterOptions;
        if (activeDatasourceFilters.length > 0) {
          const dataFilters = activeDatasourceFilters.map(f => f.value);
          data = data.filter(d => dataFilters.includes(d.Datasource));
        }

        if (activeCampaignFilters.length > 0) {
          const campaignFilters = activeCampaignFilters.map(f => f.value);
          // console.log("campaignFiltersz", campaignFilters);
          data = data.filter(d => campaignFilters.includes(d.Campaign));
          // console.log("dataz", data);
        }

        return data;
      }

      const prefilteredData = preFilterData(data);

      const dateArray = prefilteredData.map(d => d.Date);
      const uniqueDates = createUniqueArray(dateArray);

      // Aggregate data by common Date and return required Chart format
      // Potential optimization -> implement useMemo()
      const filteredAndAggregatedData = uniqueDates.map(date => {
        const dateAggregatedMetrics = prefilteredData.filter(d => d.Date === date);

        // The '+' operator is a quick way to convert string -> number
        const Clicks = dateAggregatedMetrics.reduce((a, b) => a + +b.Clicks, 0);
        const Impressions = dateAggregatedMetrics.reduce((a, b) => a + +b.Impressions, 0);

        // Date reformating required for 'react-timeseries-charts'
        // https://stackoverflow.com/a/33299764
        const dateParts = date.split('.');
        const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

        return [dateObject, Clicks, Impressions];
      });

      setFilteredData(filteredAndAggregatedData);
    }

    filterDataAndAggregateByDate(mockData);

  }, [mockData, activeFilterOptions]);

  return { filteredData };
}
