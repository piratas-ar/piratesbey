#!/usr/bin/python
# -*- coding: utf-8 -*-

import lxml.etree as etree
import sys
import os
import csv
import re

exec(open("./db.py").read())

def process_csv_torrent(id, path):
  source = 'http://thepiratebay.se/torrent/'+id
  if 
  csv_reader =  csv.reader(open(path+'/details.csv', newline="\n"), delimiter=',', quotechar='"')
  next(csv_reader)
  data = next(csv_reader)
  m = re.search('\((.+?) Bytes', data[3])
  if m:
    size = m.group(1)
  else:
    size = 0
  nfo = open(path+'/description.txt').read()
  
  return '(%s, %s, %s, %s, %s, %s)',(data[10],data[15],source,data[0],size,nfo)

csv_path = 'sources/'
i=1

# skip before this id
min_tpb_id = 8133976
max_tpb_id = 8599995
query = insert_part = "INSERT INTO torrents (uploaded, hash, source, title, size, nfo) VALUES "
values = ()


for id in range(min_tpb_id, max_tpb_id+1):
  id = str(id)
  x = id[0]
  y = id[1]
  z = id[2]
  path = csv_path+"/"+x+"xxxxxx/"+x+y+"xxxxx/"+x+y+z+"xxxx/"+id
  if os.path.isdir(path):
    q, data = process_csv_torrent(id,path)

    # The id exists and got query
    if q:
      query += q
      values = values + data
      
      # Time to commit to DB
      if len(query) > 100000:
        print(id)
        cur.execute(query, values)
        con.commit()
        query = insert_part
        values = ()
      else:
        query += ','

query = query.rstrip(',')
cur.execute(query, values)
con.commit()

