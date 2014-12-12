#!/usr/bin/python
# -*- coding: utf-8 -*-

import lxml.etree as etree
import sys

exec(open("./db.py").read())

# Rich XML parsing
def process_torrent_xml(elem):
  tpb_id=elem.find('id').text
  source='http://thepiratebay.se/torrent/'+tpb_id
  torrent = get_torrent_by_source_url(source)
  if not torrent:
    nfo = elem.find('nfo').text
    if not nfo:
      nfo = ''
    return "(%s, %s, %s, %s, %s, %s)" , (elem.find('uploaded').text,
elem.find('magnet').text, source, elem.find('title').text,
elem.find('size').text, nfo)
  else:
    return '', ()

#  save_torrent(uploaded=elem.find('uploaded').text,
#hash=elem.find('magnet').text, source=source, title=elem.find('title').text,
#size=elem.find('size').text, nfo=nfo)
#    torrent = get_torrent_by_source_url(source)
#    for comment in elem.findall('./comments/comment'):
#      if comment.find('what').text != None:
#        save_comment(torrent_id=torrent[0], comment=comment.find('what').text, date=comment.find('when').text)
#    con.commit()

xml_path = 'sources/rich-and-valid.xml'
i=1

# skip before this id
min_tpb_id = 8133616
query = insert_part = "INSERT INTO torrents (uploaded, hash, source, title, size, nfo) VALUES "
values = ()

for event, elem in etree.iterparse(xml_path, tag='torrent', no_network=True,):
  # We have a torrent and is later that the min_tpb_id
  if elem.tag == 'torrent':
    i += 1
    if i % 5000 == 0:
      i = 1
      print(elem.find('id').text)
    
    if min_tpb_id < int(elem.find('id').text):  
      q, data = process_torrent_xml(elem)

      # We got some query result
      if q:
        query += q
        values = values + data
        
        # Time to commit to DB
        if len(query) > 100000:
          cur.execute(query, values)
          con.commit()
          query = insert_part
          values = ()
        else:
          query += ','
    
    elem.clear()

query = query.rstrip(',')
cur.execute(query, values)
con.commit()
