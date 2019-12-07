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
    const abortController = new AbortController(); // Allows fetch to be cancelled

    const fetchData = async () => {
      try {
        const res = await fetch(url, { signal: abortController.signal });
        let response = null;

        if (csvFetch) {
          const text = await res.text();
          response = await csvTextToJSON(text);
        } else {
          response = await res.json();
        }

        setResponse(response);
      } catch (e) {
        if (!abortController.signal.aborted) {
          setError(e);
        }
      }
    };
    fetchData();

    return () => {
      abortController.abort(); // Cancels fetch if still running on unmount
    };
  }, [csvFetch, url]);

  return { response, error };
};
