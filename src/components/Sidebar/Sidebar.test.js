import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { Sidebar } from './Sidebar';

const defaultProps =  {
  activeFilterOptions: {
    activeCampaignFilters: [],
    activeDatasourceFilters: [],
  },
  filterOptions: { campaignFilters: [], datasourceFilters: [] },
  setActiveFilter: () => null,
};

afterEach(cleanup);

it('Sidebar renders Datasource text', () => {
  const { getByText } = render(<Sidebar { ...defaultProps } />);
  expect(getByText('Datasource')).toBeInTheDocument();
});

it('Sidebar renders Campaign text', () => {
  const { getByText } = render(<Sidebar { ...defaultProps } />);
  expect(getByText('Campaign')).toBeInTheDocument();
});
