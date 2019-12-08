### Available Scripts

Clone and run project with:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

Run rests with:

### `npm run test`

## General Functionality

- This app represents a pure client-side approach to data processing and presentation
- Prior to extraction of the business logic in App.js to a custom hook (`useAggregateData()`), this web app could sort over 32,000 lines of data AND redraw the corresponding graphs in under 200ms: Improved User experience
- Another benefit of the client-side approach is that it makes the existing backend infrastructure much more scalable: After sending the initial data payload, the server is no longer required to handle requests and filtering / aggregating data. Redistributing the computation to Clients means you can handle growth and spikes much easier than with a server-side intensive approach.

## Notes

- API requests and data handling / mocking are simplified due to the lack of a conventional API endpoint with filtering params
- Adding custom filtering / aggregation hook made the core business logic testable, however this extraction came with a noticeable impact on filtering & redraw performance. Keeping this functionality inside of App.js and simply using setState() results in much quicker sorting / redrawing.
- `useAggregateData()` custom hook was temporarily split into two separate custom hooks, one for filtering and one for aggregating - futher improving code readability. However, there was an additional performance impact as a result of this refactoring so I reverted to just one using external custom hook to handle the business logic. The prefilter-specific hook (now discarded) looked like this:

```javascript
import { useEffect, useState } from 'react';

// Main Business logic here. Filtering & Aggregating data real-time on Client
export const useDataPrefilter = (mockData, activeDatasourceFilters, activeCampaignFilters) => {

  const [preFilteredData, setPrefilteredData] = useState([]);

  // Runs: when mockData activeDatasourceFilters or activeCampaignFilters change
  // Updates: filteredData
  useEffect(() => {
    // Potential optimization -> implement useMemo()

    const preFilterData = (data, activeDatasourceFilters, activeCampaignFilters) => {
      // Filter the data by active Datasource and Campaign
      // The next lines produce an 'AND' effect.

      if (activeDatasourceFilters.length > 0) {
        const dataFilters = activeDatasourceFilters.map(f => f.value);
        data = data.filter(d => dataFilters.includes(d.Datasource));
      }

      if (activeCampaignFilters.length > 0) {
        const campaignFilters = activeCampaignFilters.map(f => f.value);
        data = data.filter(d => campaignFilters.includes(d.Campaign));
      }

      setPrefilteredData(data);
    }

    preFilterData(mockData, activeDatasourceFilters, activeCampaignFilters);

  }, [mockData,  activeDatasourceFilters, activeCampaignFilters]);

  return { preFilteredData };
}
```

## Further Improvements

- Carefully implement `useMemo()` and / or `useCallback()` to handle intensive calculations and reduce unnecessary re-rendering
- Lodash was not used because it seems ES6 functional techniques were sufficient. However, mapping and filtering via Lodash might yield performance benefits.
- Implementing Web Workers might improve filtering / aggregation by offloading computations from the main thread
- It would be fairly easy to implement localStorage to let users begin viewing / interacting with their data without waiting for a full download
