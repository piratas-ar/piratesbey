
Gracias a archive.org, tpb archive, Karel Bilek y Rick Falkvinge por la
diferente data y scripts.

# Sources

Archivos fuentes en formato compatible actualizados seran liberados como
torrent, mientras tanto:

* http://www.karelbilek.com/piratebay/
* https://github.com/tpb-archive/8xxxxxx

# The Pirate's Bey

Requirements:

* Node JS

* Java 7 (for elasticsearch)

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

Remember to configure your firewall to allow connections from ports 9200:9400 in
order to make the nodes see each other in the cluster.

# Cargar Sources y Scrapear TPB(s)

Los scripts estan tan optimizados como fue posible, los sources no estan
incluidos (por ahora).

 bin/db.py
 ---------
 con = mdb.connect(host='localhost', user='root', passwd='', db='piratesbey');


Cargar desde un mirror
 python bay2bey_torrents.py 
 --------------------------
 source_site = 'http://oldpiratebay.org'
 min_tpb_id = 3211594
 max_tpb_id = 11671120

Cargar desde un backup en formato csv (tpb-archive)
 python csv2bey_torrents.py
 --------------------------
 csv_path = 'sources/'
 min_tpb_id = 3211594
 max_tpb_id = 11671120

Cargar desde un backup en formato xml (karel)
 python xml2bey_torrents.py
 --------------------------
 python xml2bey_comments.py
 --------------------------
 xml_path = 'sources/rich-and-valid.xml'
 min_tpb_id = 3211594
