### Available Scripts

Clone and run project with:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.


## Notes

- Tests and Redux were not implemented due to time constraints and they were not explicitly asked for
- API requests and data handling / mocking are simplified due to the lack of a conventional API endpoint with filtering params
- Very little time was spent on style refinement. Same for mobile / tablet views.

- In total less than 400 lines of code across 3 .js files
- Most state is kept in the top-most Api.js file, with two child components accepting necessary props

## Further Improvements

- Code could probably still be refined / refactored / optimised
- Lodash was not used because it seems ES6 functional techniques were sufficient
- Implementing Web Workers might make the local in-client filtering faster
- In a real setting, I would look into some optimisation possibilities and test / compare various possibilities
