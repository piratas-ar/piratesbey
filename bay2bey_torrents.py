from lxml import html
import requests

exec(open("./db.py").read())


min_tpb_id = 8599982
max_tpb_id = 11000000

source = 'http://tpb.pirati.cz'

for id in range(min_tpb_id, max_tpb_id+1):
  page = requests.get(source+'/torrent/'+str(id)+'/zez/')
  tree = html.fromstring(page.text)
  title = tree.xpath('//title/text()')[0]
  print(title)
  
