const { persistedQueries } = require('../index');

const cacheLength = 3;
let fakeReq = { query: 1 };
const fakeRes = { b: 2 };
const fakeNext = { c: 3 };

describe('persistedQueries Bypass test',() => {

  it(`Calls next middleware if key 'extensions' is not present`, () => {
    const fakeRequestHandler = (req, res, next) => {
      return {...req, ...res, ...next};
    };
    expect(persistedQueries(fakeRequestHandler, cacheLength)(fakeReq, fakeRes, fakeNext))
      .toEqual({...fakeReq, ...fakeRes, ...fakeNext});
  });

});

describe('persistedQueries test',() => {

  const fakeRequestHandler = (req, res, next) => {
    return;
  };

  it(`Returns 200 with 'PersistedQueryNotFound message'`, () => {
    fakeReq['query'] = {
      extensions: JSON.stringify({
        persistedQuery: {
          sha256Hash: 'FGHJI'
        }
      })
    }
    fakeRes['send'] = (code, responseObject) => [code, responseObject];
    expect(persistedQueries(fakeRequestHandler, cacheLength)(fakeReq, fakeRes, fakeNext))
      .toEqual([200, {"errors":[{"message":"PersistedQueryNotFound"}]}]);
      
  });

  it(`Returns 200 with the stored query`, () => {
    const fakeReq1 = {
      query: {
        query: 'This is a query', 
        extensions: JSON.stringify({
          persistedQuery: {
            sha256Hash: 'ABCDE'
          }
        })
      }
    }
    
    const fakeReq2 = {
      query: {
        extensions: JSON.stringify({
          persistedQuery: {
            sha256Hash: 'ABCDE'
          }
        })
      }
    }

    const fakeRequestHandler = (req, res, next) => {
      return req;
    };

    expect(persistedQueries(fakeRequestHandler, cacheLength)(fakeReq1, fakeRes, fakeNext))
      .toEqual(fakeReq1);

    
    expect(persistedQueries(fakeRequestHandler, cacheLength)(fakeReq2, fakeRes, fakeNext))
      .toEqual({ query: { query: 'This is a query'}});
      
  });

});