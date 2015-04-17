<a href="README.en.md">Read this in English</a>

Gracias a archive.org, tpb archive, Karel Bilek y Rick Falkvinge por la
diferente data y scripts.

# Copia de la base de datos

Esta base de datos esta compuesta por diferentes backups y escrapeos que
hicimos, podes colaborar con los torrents faltantes.

```
magnet:?xt=urn:btih:d508374e1f8efb47e47fb5e85f1fbdc412215190&dn=tpb-2014-12-23&tr=http%3A%2F%2Fdb.tpb.partidopirata.com.ar%3A12345%2Fannounce
```

# Fuentes

Archivos fuentes en formato compatible actualizados seran liberados como
torrent, mientras tanto:

* http://www.karelbilek.com/piratebay/
* https://github.com/tpb-archive/8xxxxxx
* https://www.reddit.com/r/thepiratebay/comments/2p4b6h/20140918_latest_dump_of_thepiratebayse_index/

# The Pirate's Bey

Requerimientos:

* Node JS

* Java 7 (para elasticsearch)

Corriendo la aplicación:

1. Clona el repositorio

2. Corre ```npm install```

3. Crea la base de datos con tu cliente mysql

```
create database piratesbey_dev;
grant all privileges on piratesbey_dev.* to 'piratesbey'@'localhost' identified
by 'piratesbey';
flush privileges;
```

4. Corre ```node index.js``` y visita la aplicación en ```http://localhost:1337```

## Motor de búsquedas

Usa [Elastic Search](http://www.elasticsearch.org/overview/elasticsearch)  para 
crear un motor de busquedas de torrents distribuido. Cualquiera podrá unirse a
la red para hostear la base de datos de torrents mas grande del mundo.

El motor de búsqueda esta embebido en la aplicación, asi que solo necesitas
seguir las instrucciones de instalación y el sitio lo usara por default.

Los nuevos torrents agregados a la base de datos se sincronizaran
automaticamente con el motor de búsqueda.

Recuerda configurar tu firewall para permitir conexiones de los puertos
9200:9400 para que los nodos se vean entre ellos.

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

Cargar desde un backup en formato csv (reddit)

    python csv2bey2_torrents.py
    ---------------------------
    csv_path = 'sources/tpb.txt'

Si te da error de byte NULL simplemente buscalo y borralo

    grep -Pan '\x00' ../sources/tpb-9-14.txt
