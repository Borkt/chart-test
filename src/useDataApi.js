import { useEffect, useState } from "react";

// Adapted from: http://techslides.com/convert-csv-to-json-in-javascript
const csvTextToJSON = (csv) => {
  const lines = csv.split('\n');
  const headers = lines[0].split(',');

  return lines.map((line, i) => {
    if (i === 0) {
      return null;
    }
    const obj = {};
    const currentline = lines[i].split(',');
    headers.forEach((header, i) => obj[headers[i]] = currentline[i]);
    return obj;
  }).filter(r => (r !== null) && (r.Date.length > 0));
}

export const useFetchApi = ({url, csvFetch}) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(url);
        if (csvFetch) {
          const text = await res.text();
          const csvToText = await csvTextToJSON(text);
          setResponse(csvToText);
        } else {
          const json = await res.json();
          setResponse(json);
        }
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [csvFetch, url]);
  return { response, error };
};
