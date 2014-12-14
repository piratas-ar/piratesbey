from lxml import html, etree
from datetime import datetime
import asyncio, aiohttp, re, time

exec(open("./db.py").read())

def process_torrent_bay(page, source):
  try:
    tree = html.fromstring(page)
    page_title = tree.xpath('//title/text()')
    if len(page_title) == 0:
      return
    page_title = page_title[0]

    if page_title != "Download music, movies, games, software! The Pirate Bay - The world's most resilient BitTorrent site":

      m = re.search('magnet:\?xt=urn:btih:(.*?)(&|")', page)
      if m:
        hash = m.group(1)

        title = tree.xpath('//div[@id="title"]/text()')
        if title: 
          title = title[0]
        else:
          title = tree.xpath('//div[@id="title"]/a/text()')[0]

        m = re.search('dt>Uploaded:</dt[^<]*<dd>(.*?)<', page)
        if m:
          dt = datetime.strptime(m.group(1),'%b %d, %Y')
          f = '%Y-%m-%d %H:%M:%S'
          uploaded = dt.strftime(f)
        else:
          uploaded = ''

        m = re.search('dt>Size:</dt[^<]*<dd>(.*?)<', page)
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
        elif size.find('B') != -1:
          size= int(float(size.rstrip('B')))
        else:
          size= 0

        nfo = tree.xpath('//div[@class="nfo"]/pre')[0]
        nfo = html.tostring(nfo)
        nfo = str(nfo[5:-6])

        save_torrent(uploaded, hash, source, str(title), size, nfo)
        con.commit()
        print(source)
  except Exception as err:
    print(err)

min_tpb_id = 8618000
max_tpb_id = 11671120
failed = []

def load_id(id):
  source_site = 'http://oldpiratebay.org'
  source = 'http://thepiratebay.se/torrent/'+str(id)
  url = source_site+'/torrent/'+str(id)+'/zez/'
  with (yield from sem):
    try:
      if not get_torrent_by_source_url(source):
        response = yield from aiohttp.request('GET', url, allow_redirects=True, compress=True)
        if response and response.status == 200:
          page = yield from response.read_and_close()
          process_torrent_bay(str(page), source)
    except Exception as err:
      print('fail '+url)
      print(err)
      failed.append(id)
    
def main():
  global failed 
  round = 0
  rate = 500
  while min_tpb_id + round*rate < max_tpb_id+1:
    round += 1
    coros = []
    before = time.time()

    for id in range(min_tpb_id,min(min_tpb_id + round*rate ,max_tpb_id+1)):
      coros.append(asyncio.Task(load_id(id)))

    for id in failed:
      print('Retrying '+id)
      coros.append(asyncio.Task(load_id(id)))
    
    yield from asyncio.gather(*coros)
    print(str(time.time() - before) + ' sec x round of ' + str(rate+len(failed)) )
    before = time.time()
    failed = []

sem = asyncio.Semaphore(14)
loop = asyncio.get_event_loop()
loop.run_until_complete(main())
