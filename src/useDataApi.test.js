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

  // note, this is an `async` test
  it('GETs data from the server', async () => {
    const expectedData = { zest: "data" }; // Define mocked data

    // setup the server
    server.respondWith('GET', url, [200, {}, JSON.stringify(expectedData)]);

    // setup our hook
    const { result, waitForNextUpdate } = renderHook(() => useFetchApi({url}));

    // just to make sure our data is still `null` at this point
    expect(result.current.response).toBeNull();

    // tell our server it's time to respond!
    server.respond();

    // magic! we will wait until our hook finishes updating its internal states;
    await waitForNextUpdate();

    // assert the outcomes!
    expect(result.current.response).toEqual(expectedData);
    expect(result.current.error).toBeNull();
  });

  // note, this is an `async` test
  it('Responds with an appropriate error', async () => {
    // setup the server
    server.respondWith('GET', url, [400, {}, '']);

    // setup our hook
    const { result, waitForNextUpdate } = renderHook(() => useFetchApi({url}));

    // just to make sure our data is still `null` at this point
    expect(result.current.response).toBeNull();
    expect(result.current.error).toBeNull();

    // tell our server it's time to respond!
    server.respond();

    // magic! we will wait until our hook finishes updating its internal states;
    await waitForNextUpdate();

    // assert the outcomes!
    expect(result.current.response).toBeNull();
    expect(result.current.error).toBeTruthy();
  });
});
