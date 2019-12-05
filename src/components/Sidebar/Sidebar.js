import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import './Sidebar.css';

export const Sidebar = ({
  activeFilterOptions,
  filterOptions,
  setActiveFilter,
}) => {

  const { campaignFilters, datasourceFilters } = filterOptions;
  const { activeCampaignFilters, activeDatasourceFilters } = activeFilterOptions;

  return (
    <div className='Sidebar'>
      <h2 className='Sidebar-title'>Datasource</h2>
      <Select
        className='Sidebar-react-select'
        classNamePrefix='Sidebar-react-select'
        isSearchable={true}
        isMulti={true}
        value={activeDatasourceFilters}
        onChange={e => setActiveFilter(e, 'activeDatasourceFilters')}
        options={datasourceFilters}
      />

      <h2 className='Sidebar-title'>Campaign</h2>
      <Select
        className='Sidebar-react-select'
        classNamePrefix='Sidebar-react-select'
        isSearchable={true}
        isMulti={true}
        value={activeCampaignFilters}
        onChange={e => setActiveFilter(e, 'activeCampaignFilters')}
        options={campaignFilters}
      />
    </div>
  );
}

Sidebar.propTypes = {
  activeFilterOptions: PropTypes.objectOf(PropTypes.array),
  filterOptions: PropTypes.objectOf(PropTypes.array),
  setActiveFilter: PropTypes.func.isRequired,
};
