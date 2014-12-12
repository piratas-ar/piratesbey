from lxml import html, etree
import requests
import re
from datetime import datetime

exec(open("./db.py").read())

source_site = 'http://thepiratebay.ee'
min_tpb_id = 8599995
max_tpb_id = 11000000

for id in range(min_tpb_id, max_tpb_id+1):

  source = 'http://thepiratebay.se/torrent/'+str(id)
  
  if not get_torrent_by_source_url(source):

    page = requests.get(source_site+'/torrent/'+str(id)+'/zez/')
    tree = html.fromstring(page.text)
    page_title = tree.xpath('//title/text()')[0]

    if page_title != "Download music, movies, games, software! The Pirate Bay - The world's most resilient BitTorrent site":

      m = re.search('magnet:\?xt=urn:btih:(.*?)(&|")', page.text)
      if m:
        hash = m.group(1)
        title = tree.xpath('//div[@id="title"]/text()')[0]

        m = re.search('dt>Uploaded:</dt[^<]*<dd>(.*?)<', page.text)
        if m:
          dt = datetime.strptime(m.group(1),'%b %d, %Y')
          f = '%Y-%m-%d %H:%M:%S'
          uploaded = dt.strftime(f)
        else:
          uploaded = ''

        m = re.search('dt>Size:</dt[^<]*<dd>(.*?)<', page.text)
        if m:
          size = m.group(1)
        else:
          size = '0'

        if size.find('TB') != -1:
          size= int(float(size.rstrip('TB'))*1024*1024*1024*1024)
        elif size.find('GB') != -1:
          size= int(float(size.rstrip('GB'))*1024*1024*1024)
        elif size.find('MB') != -1:
          size= int(float(size.rstrip('MB'))*1024*1024)
        elif size.find('KB') != -1:
          size= int(float(size.rstrip('KB'))*1024)
        else:
          size= int(size)

        nfo = tree.xpath('//div[@class="nfo"]/pre')[0]
        nfo = html.tostring(nfo)
        nfo = str(nfo[5:-6])

        save_torrent(uploaded, hash, source, str(title), size, nfo)
        con.commit()
        print(source)
  
    
