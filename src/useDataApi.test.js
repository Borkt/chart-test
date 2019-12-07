import { renderHook } from "@testing-library/react-hooks";
import "whatwg-fetch";
import { fakeServer } from 'sinon';

import { useFetchApi } from "./useDataApi";

// Setup fake server. Hold a reference to the server to tell it
// when/what to respond to requests (and clean it up later)
let server;

const url = '/foo/bar';

describe("useFetchApi", () => {
  beforeEach(() => {
    server = fakeServer.create();
  });

  afterEach(() => {
    server.restore();
  });

  it('returns proper initial state', () => {
    const { result } = renderHook(() => useFetchApi({url}));

    expect(result.current.response).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('GETs data from the server', async () => {
    const expectedData = { zest: "data" };

    server.respondWith('GET', url, [200, {}, JSON.stringify(expectedData)]);

    const { result, waitForNextUpdate } = renderHook(() => useFetchApi({url}));

    expect(result.current.response).toBeNull();

    server.respond();

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.response).toEqual(expectedData);
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('Responds with an appropriate error', async () => {
    server.respondWith('GET', url, [400, {}, '']);

    const { result, waitForNextUpdate } = renderHook(() => useFetchApi({url}));

    expect(result.current.response).toBeNull();
    expect(result.current.error).toBeNull();

    server.respond();

    expect(result.current.isLoading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.response).toBeNull();
    expect(result.current.error).toBeTruthy();
    expect(result.current.isLoading).toBe(false);
  });
});
