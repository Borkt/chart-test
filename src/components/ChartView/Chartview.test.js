import React from 'react';
import { act, cleanup, render } from '@testing-library/react';
import { ChartView } from './ChartView';

import { mockData } from '../../mock-data/mockData';

const defaultInitialProps =  {
  activeFilterOptions: {
    activeCampaignFilters: [],
    activeDatasourceFilters: [],
  },
  data: [],
};

const propsWithMockedDataNoFilters = {
  activeFilterOptions: mockData.activeFilterOptions,
  data: mockData.data,
};

afterEach(cleanup);

it('ChartView renders Chart initial text', () => {
  const { getByText } = render(<ChartView { ...defaultInitialProps } />);
  expect(getByText('Data Loading or Unavailable...')).toBeInTheDocument();
});

it('ChartView renders Chart onload text', async () => {
  await act(async () => {
    const { getByText } = render(<ChartView { ...propsWithMockedDataNoFilters } />);
    getByText('Datasource: All and Metrics: All Campaigns');
  })
});

it('ChartView renders Chart two filters selected', async () => {
  

  await act(async () => {
    const { getByText } = render(<ChartView { ...propsWithMockedDataNoFilters } />);
    getByText('Datasource: All and Metrics: All Campaigns');
  })
});
