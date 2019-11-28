import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import './Sidebar.css';

export const Sidebar = ({
  activeCampaignFilters,
  activeDatasourceFilters,
  campaignFilterOptions,
  datasourceFilterOptions,
  setCampaignFilter,
  setDatasourceFilter,
}) => {

  return (
    <div className="Sidebar">
      <Select
        className="Sidebar-react-select"
        classNamePrefix="Sidebar-react-select"
        isSearchable={true}
        isMulti={true}
        value={activeCampaignFilters}
        onChange={setCampaignFilter}
        options={campaignFilterOptions}
      />

      <Select
        className="Sidebar-react-select"
        classNamePrefix="Sidebar-react-select"
        isSearchable={true}
        isMulti={true}
        value={activeDatasourceFilters}
        onChange={setDatasourceFilter}
        options={datasourceFilterOptions}
      />
    </div>
  );
}

Sidebar.propTypes = {
  activeCampaignFilters: PropTypes.array.isRequired,
  activeDatasourceFilters: PropTypes.array.isRequired,
  campaignFilterOptions: PropTypes.array.isRequired,
  datasourceFilterOptions: PropTypes.array.isRequired,
  setCampaignFilter: PropTypes.func.isRequired,
  setDatasourceFilter: PropTypes.func.isRequired,
};
