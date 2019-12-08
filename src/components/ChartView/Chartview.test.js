import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { ChartView } from './ChartView';

// import { mockData } from '../../mock-data/mockData';

const defaultInitialProps =  {
  activeFilterOptions: {
    activeCampaignFilters: [],
    activeDatasourceFilters: [],
  },
  data: [],
};

// const propsWithMockedData = {
//   activeFilterOptions: mockData.activeFilterOptions,
//   data: mockData.data,
// };

afterEach(cleanup);

// Internal Chart functionality is not tested because that is
// handled internally by the 'react-timeseries-charts' package

describe('ChartView', () => {
  it('matches previous Snapshot', () => {
    const { asFragment } = render(<ChartView { ...defaultInitialProps } />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders Chart initial text', () => {
    const { getByText } = render(<ChartView { ...defaultInitialProps } />);
    expect(getByText('Data Loading or Unavailable...')).toBeInTheDocument();
  });

  // it('renders Chart onload text', async () => {
  //   await act(async () => {
  //     const { getByText } = render(<ChartView { ...propsWithMockedData } />);
  //     expect(getByText('Datasource: All and Metrics: All Campaigns')).toBeInTheDocument();
  //   })
  // });
});
