
Thanks to archive.org, tpb archive, Karel Bilek and Rick Falkvingre for the
data and scripts. 

# Database copy

```
magnet:?xt=urn:btih:d508374e1f8efb47e47fb5e85f1fbdc412215190&dn=tpb-2014-12-23&tr=http%3A%2F%2Fdb.tpb.partidopirata.com.ar%3A12345%2Fannounce
```

# Sources

These were the original sources, updates in compatible format are being
released.

* http://www.karelbilek.com/piratebay/
* https://github.com/tpb-archive/8xxxxxx
* https://www.reddit.com/r/thepiratebay/comments/2p4b6h/20140918_latest_dump_of_thepiratebayse_index/

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

# Load sources and scrap TPB(s)

Scripts are optimized as much as possible, sources not included.

    bin/db.py
    ---------
    con = mdb.connect(host='localhost', user='root', passwd='', db='piratesbey');

Load from mirror

    python bay2bey_torrents.py 
    --------------------------
    source_site = 'http://oldpiratebay.org'
    min_tpb_id = 3211594
    max_tpb_id = 11671120

Load from backup in csv format (tpb-archive)

    python csv2bey_torrents.py
    --------------------------
    csv_path = 'sources/'
    min_tpb_id = 3211594
    max_tpb_id = 11671120

Load from backup in xml format (karel)

    python xml2bey_torrents.py
    --------------------------
    python xml2bey_comments.py
    --------------------------
    xml_path = 'sources/rich-and-valid.xml'
    min_tpb_id = 3211594

Load from backup in csv format (reddit)
    python csv2bey2_torrents.py
    ---------------------------
    csv_path = 'sources/tpb.txt'

if you get NULL byte error simply search for it and erase it
    grep -Pan '\x00' ../sources/tpb-9-14.txt
