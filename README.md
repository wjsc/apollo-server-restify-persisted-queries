[![NPM](https://nodei.co/npm/apollo-server-restify-persisted-queries.png?downloads)](https://nodei.co/npm/apollo-server-restify-persisted-queries)

# apollo-server-restify-persisted-queries
Tiny in-memory automatic persisted queries middleware for apollo-server-restify

Since apollo-server-restify uses Apollo Server 1.x, it has not support for APQ. 
Use this module to get server support.

This package implements a circular buffer that persists the latest X queries in a in-memory Map.

## Usage
```
import restify from 'restify';
import { graphqlRestify } from 'apollo-server-restify';

// 1. Import the module
import { persistedQueries } from 'apollo-server-restify-persisted-queries';

// 2. Set the number of cached queries
const cacheLength = 10;

const server = restify.createServer({
  title: 'Apollo Server',
});
 
const graphQLOptions = { schema: myGraphQLSchema };
 
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser());

// 3. Call the persistedQueries method, ant it returns a Middleware
server.get('/graphql', persistedQueries(graphqlRestify(graphQLOptions)), cacheLength);
 
server.listen(3000, () => console.log(`Listening on port 3000`));
```

## Official Docs
https://www.apollographql.com/docs/guides/performance.html#automatic-persisted-queries
