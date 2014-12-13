
Gracias a archive.org, tpb archive, Karel Bilek y Rick Falkvinge por la
diferente data y scripts.

# Sources

Archivos fuentes en formato compatible actualizados seran liberados como
torrent, mientras tanto:

* http://www.karelbilek.com/piratebay/
* https://github.com/tpb-archive/8xxxxxx

# The Pirate Bey

Requirements:

* Node JS

* Java 7

Running the application:

1. Clone this repository

2. Run ```npm install```

3. Setup the database using your mysql client

```
create database piratesbey_dev;
grant all privileges on piratesbey_dev.* to 'piratesbey'@'localhost' identified
by 'piratesbey';
flush privileges;
```

4. Run ```node index.js``` and check out the app at ```http://localhost:1337```

## Search engine

It uses [Elastic Search](http://www.elasticsearch.org/overview/elasticsearch) to
create a distributed search engine for torrents. Anyone will be able to join the
network to host the bigger torrents database in the world.

The search engine is embedded into the application, so you just need to follow
the installation instructions and the site will use it by default.

New torrents added to the database will be automatically synchronized with the
search engine.
