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

// Internal Dropdown functionality is not tested because
// that is handled internally by the 'react-select' package

describe('Sidebar', () => {
  it('matches previous Snapshot', () => {
    const { asFragment } = render(<Sidebar { ...defaultProps } />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders Campaign & Datasource text', () => {
    const { getByText } = render(<Sidebar { ...defaultProps } />);
    expect(getByText('Datasource')).toBeInTheDocument();
    expect(getByText('Campaign')).toBeInTheDocument();
  });
});
