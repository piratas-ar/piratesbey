#!/usr/bin/python
# -*- coding: utf-8 -*-

import sys
import os
import csv

exec(open("./db.py").read())

def process_csv_torrent(id, title, size, seeders, leechers, hash):
  source = 'http://thepiratebay.se/torrent/'+id
  return '(%s, %s, %s, %s, %s, %s)',(hash, source, title, size, seeders, leechers)

csv_path = '../sources/tpb-9-14.txt'
i=1

# skip before this id
query = insert_part = "INSERT INTO torrents (hash, source, title, size, seeders, leechers) VALUES "
values = ()

def get_csv_rows(filename):
  with open(filename, "r") as csvfile:
    datareader = csv.reader(csvfile, delimiter='|', quoting=csv.QUOTE_NONE)
    for row in datareader:
      yield row

def fix_row(row):
  nfo = ''
  while len(row) > 6:
    nfo += '|'+row.pop(2)
  row[1] += nfo
  return row
    
for row in get_csv_rows(csv_path):
  if len(row) > 6:
    row = fix_row(row)
  if len(row) != 6:
    print('FAIL')
    print(row)
    continue
  q, data = process_csv_torrent(row[0],row[1],row[2],row[3],row[4],row[5])

  # The id exists 
  if q:
    query += q
    values = values + data

    # Time to commit to DB
    if len(query) > 100000:
      print(row[0])
      query += ' ON DUPLICATE KEY UPDATE size=VALUES(size), seeders=VALUES(seeders), leechers=VALUES(leechers)'
      cur.execute(query, values)
      con.commit()
      query = insert_part
      values = ()
    else:
      query += ','

query = query.rstrip(',')
query += ' ON DUPLICATE KEY UPDATE size=VALUES(size), seeders=VALUES(seeders), leechers=VALUES(leechers)'
cur.execute(query, values)
con.commit()
