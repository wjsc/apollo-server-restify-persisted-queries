let cache = [];

export const persistedQueries = (RequestHandler, cacheLength) => (req, res, next) => {

  if((req.query && req.query.extensions) || (req.body && req.body.extensions)){
    const transport = req.query.extensions ? 'query' : 'body';
    const extensions = transport === 'query' ? JSON.parse(req[transport].extensions) : req[transport].extensions;
    delete req[transport].extensions;
    const sha256Hash = extensions.persistedQuery.sha256Hash;
    const query = req[transport].query;
    const persistedQuery = cache.find( kv => kv.sha256Hash === sha256Hash );
    if(!persistedQuery && query) {
      cache.push({ sha256Hash , query });
      cache = cache.slice(-cacheLength);
    }

    if(!persistedQuery && !query){
      return res.send(200, {"errors":[{"message":"PersistedQueryNotFound"}]});
    }
    req[transport].query = req[transport].query || persistedQuery.query;
  }

  return RequestHandler(req, res, next);
}
