import React from 'react';
import { ChartView, Sidebar } from './components';

import './App.css';

const App = () => {
  return (
    <div className="App">
      <Sidebar />

      <ChartView />
    </div>
  );
}

export default App;
