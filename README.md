### Available Scripts

Clone and run project with:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## General Functionality

- This app represents a pure client-side approach to data processing and presentation
- Prior to extraction of the business logic in App.js to a custom hook (`useAggregateData()`), this web app could sort over 32,000 lines of data AND redraw the corresponding graphs in under 200ms: User experience improves.
- Another benefit of this approach is that it makes the backend infrastructure much more scalable: After sending the initial data payload, the server is no longer required to handle requests and filtering / aggregating data.

## Notes

- API requests and data handling / mocking are simplified due to the lack of a conventional API endpoint with filtering params
- Adding custom filtering / aggregation hook made this business logic testable, however this extraction came with a noticeable impact on filtering & redraw performance. Keeping this functionality inside of App.js and simply using setState() results in much quicker sorting / redrawing
- `useAggregateData()` custom hook was also split into two separate custom hooks, one for filtering and one for aggregating - thereby improving code readability. However, the additional performance impact as a result of this refactoring was such that I reverted to just one external custom hook to handle all filtering and aggregating.

## Further Improvements

- Implement `useMemo()`` and / or `useCallback()` to handle intensive calculations and reduce unnecessary re-rendering
- Lodash was not used because it seems ES6 functional techniques were sufficient
- Implementing Web Workers might make the local in-client filtering faster
