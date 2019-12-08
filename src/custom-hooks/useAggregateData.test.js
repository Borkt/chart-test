import { renderHook } from '@testing-library/react-hooks';
import { useAggregateData } from './useAggregateData';

import { mockData } from '../mock-data/mockData';

const mockEmptyFilters = {
  activeCampaignFilters: [],
  activeDatasourceFilters: [],
}

const filter = {
  activeCampaignFilters: [],
  activeDatasourceFilters: [
    { "label": "Google Adwords", "value": "Google Adwords" },
    { "label": "Google Analytics", "value": "Google Analytics" }
  ],
};

const filter2 = {
  activeCampaignFilters: [],
  activeDatasourceFilters: [ { "label": "Mailchimp", "value": "Mailchimp" } ],
};

const filter3 = {
  activeCampaignFilters: [ { "label": "Like Ads", "value": "Like Ads" } ],
  activeDatasourceFilters: [],
};

const filter4 = {
  activeCampaignFilters: [ { "label": "Like Ads", "value": "Like Ads" } ],
  activeDatasourceFilters: [
    { "label": "Google Adwords", "value": "Google Adwords" },
    { "label": "Google Analytics", "value": "Google Analytics" }
  ],
};

const filter5 = {
  activeCampaignFilters: [ { "label": "B2B - Leads", "value": "B2B - Leads" } ],
  activeDatasourceFilters: [],
}

describe('useAggregateData', () => {
  it('returns proper initial state', () => {
    const { result } = renderHook(() => useAggregateData([]));
    expect(result.current.filteredData).toEqual(expect.arrayContaining([]));
  });

  it('returns correct unfiltered mock data length', () => {
    const { result } = renderHook(() => useAggregateData(mockData.data, mockEmptyFilters));
    expect(result.current.filteredData.length).toEqual(5);
  });

  it('returns correct filtered mock data length filter1', () => {
    const { result } = renderHook(() => useAggregateData(mockData.data, filter));
    expect(result.current.filteredData.length).toEqual(5);
  });

  it('returns correct filtered mock data length filter2', () => {
    const { result } = renderHook(() => useAggregateData(mockData.data, filter2));
    expect(result.current.filteredData.length).toEqual(4);
  });

  it('returns correct filtered mock data length filter3', () => {
    const { result } = renderHook(() => useAggregateData(mockData.data, filter3));
    expect(result.current.filteredData.length).toEqual(5);
  });

  it('returns correct filtered mock data length filter4', () => {
    const { result } = renderHook(() => useAggregateData(mockData.data, filter4));
    expect(result.current.filteredData.length).toEqual(0);
  });

  it('returns correct filtered mock data length filter5', () => {
    const { result } = renderHook(() => useAggregateData(mockData.data, filter5));
    expect(result.current.filteredData.length).toEqual(5);
  });
});
