# socket.io-adapter-mongo

*This module is modified from [socket.io-redis](https://github.com/Automattic/socket.io-redis)

## How to use

```js
var io = require('socket.io')(3000);
var mongo = require('socket.io-adapter-mongo');
io.adapter(mongo({ host: 'localhost', port: 27017, db: 'mubsub' }));
```

By running socket.io with the `socket.io-adapter-mongo` adapter you can run
multiple socket.io instances in different processes or servers that can
all broadcast and emit events to and from each other.

If you need to emit events to socket.io instances from a non-socket.io
process, you should use [socket.io-emitter](http:///github.com/Automattic/socket.io-emitter).

## API

### adapter(uri[, opts])

`uri` is a string like `localhost:27017` where your mongo server
is located. For a list of options see below.

### adapter(opts)

The following options are allowed:

- `key`: the name of the key to pub/sub events on as prefix (`socket.io`)
- `host`: host to connect to mongo on (`localhost`)
- `port`: port to connect to mongo on (`27017`)
- `db`: db to use in mongo (`mubsub`)
- `socket`: unix domain socket to connect to mongo (`"/tmp/mongo.sock"`). Will
  be used instead of the host and port options if specified.
- `client`: optional, the mubsub client to publish events on

If you decide to supply a client, make sure you use [mubsub](https://github.com/scttnlsn/mubsub) as a client or one with an equivalent API.

## License

MIT
