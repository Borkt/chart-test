import React from 'react';
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

export const ChartView = ({data}) => {
  if (data.length === 0) {
    return (
      <div className="ChartView">
        Loading...
      </div>
    );
  }

  const points = data.map(d => [d.Date, d.Clicks, d.Impressions]);

  const series = new TimeSeries({
    name: "Values",
    columns: ["time", "clicks", "impressions"],
    points,
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
        title="Datasource (All)"
        titleStyle={{ fill: "#555", fontWeight: 500, fontSize: "24px" }}
        width={1000}
      >
        <ChartRow height="500">
            <YAxis
              id="axis1"
              label="Clicks"
              max={50000}
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
              max={5000000}
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
