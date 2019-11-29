import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TimeSeries } from "pondjs";
import {
  ChartContainer,
  ChartRow,
  Charts,
  Legend,
  LineChart,
  styler,
  YAxis,
} from "react-timeseries-charts";

import './ChartView.css';

export const ChartView = ({
  activeCampaignFilters,
  activeDatasourceFilters,
  data,
}) => {
  const [chartTitle, setChartTitle] = useState([]);

  useEffect(() => {
    const generateTitle = () => {
      let campaignTitle = " and Metrics: ";
      let datasourceTitle = "Datasource: "

      if (activeCampaignFilters.length > 0) {
        campaignTitle += activeCampaignFilters.map(f => f.value).join(", ");
      } else {
        campaignTitle += "All Campaigns";
      }

      if (activeDatasourceFilters.length > 0) {
        datasourceTitle += activeDatasourceFilters.map(f => f.value).join(", ") + " ";
      } else {
        datasourceTitle += "All ";
      }

      // return datasourceTitle + " / " + campaignTitle;
      setChartTitle(datasourceTitle + campaignTitle);
    }

    generateTitle();
  }, [activeCampaignFilters, activeDatasourceFilters]);


  if (data.length === 0) {
    return (
      <div className="ChartView">
        Data Loading or Unavailable...
      </div>
    );
  }

  const series = new TimeSeries({
    name: "Values",
    columns: ["time", "clicks", "impressions"],
    points: data,
  });

  const chartStyler = styler([
    {key: "clicks", color: "#2ca02c", width: 1},
    {key: "impressions", color: "#9467bd", width: 1}
  ]);


  const legendStyler = styler([
    {key: "clicks", color: "#2ca02c", width: 3 },
    {key: "impressions", color: "#9467bd", width: 3},
  ]);

  return (
    <div className="ChartView">
      <ChartContainer
        timeRange={series.range()}
        title={chartTitle}
        titleStyle={{ fill: "#555", fontWeight: 500, fontSize: "24px" }}
        width={900}
      >
        <ChartRow height="400">
            <YAxis
              id="axis1"
              label="Clicks"
              max={series.max("clicks")}
              min={0}
              type="linear"
              width="100"
            />
            <Charts>
                <LineChart
                  axis="axis1"
                  columns={["clicks"]}
                  series={series}
                  style={chartStyler}
                />
                <LineChart
                  axis="axis2"
                  columns={["impressions"]}
                  series={series}
                  style={chartStyler}
                />
            </Charts>
            <YAxis
              id="axis2"
              label="Impressions"
              max={series.max("impressions")}
              min={0}
              type="linear"
              width="100"
            />
        </ChartRow>
      </ChartContainer>

      <Legend
        type="swatch"
        align="right"
        style={legendStyler}
        categories={[
            { key: "clicks", label: "Clicks" },
            { key: "impressions", label: "Impressions" }
        ]}
      />
    </div>
  );
}

ChartView.propTypes = {
  activeCampaignFilters: PropTypes.array.isRequired,
  activeDatasourceFilters: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};
