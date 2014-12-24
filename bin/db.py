import mysql.connector as mdb

# Connect to database
try:
  con = mdb.connect(host='localhost', user='root', passwd='', db='laterbey');
  cur = con.cursor()

except mdb.Error as e:
    print("Error %d: %s" % (e.args[0],e.args[1]))
    sys.exit(1)

#finally:    
#  if con:    
#    con.close()

cur.execute('SET @@session.unique_checks = 0')
cur.execute('SET @@session.foreign_key_checks = 0')
cur.execute('SET GLOBAL max_allowed_packet = 173741824')
#cur.execute('SET GLOBAL innodb_autoinc_lock_mode = 2')
con.commit()

# General database functions
def save_torrent(uploaded, hash, source, title, size=0, nfo='', seeders=0, leechers=0):
  add_torrent = ("INSERT INTO torrents "
                "(uploaded, hash, source, title, size, nfo, seeders, leechers) "
                "VALUES (%(uploaded)s, %(hash)s, %(source)s, %(title)s, %(size)s, %(nfo)s, %(seeders)s, %(leechers)s);")
  
  data_torrent = { 'uploaded': uploaded, 'hash': hash, 'source': source,
'title': title, 'size': size, 'nfo': nfo, 'seeders': seeders, 'leechers': leechers }
  
  cur.execute(add_torrent, data_torrent)
  con.commit()

  if cursor.lastrowid:
    return cursor.lastrowid

def get_torrent_by_source_url(source):
  get_torrent = ("SELECT * FROM torrents WHERE source = %(source)s LIMIT 1;")
  data_torrent = { 'source': source }
  cur.execute(get_torrent, data_torrent)
  return cur.fetchone()

def save_comment(torrent_id, comment, date='', author=''):
  add_comment = ("INSERT INTO comments "
                "(torrent_id, date, author, comment) "
                "VALUES (%(torrent_id)s, %(date)s, %(author)s, %(comment)s);")
  
  data_comment = { 'torrent_id': torrent_id, 'date': date, 'author': author,
'comment': comment }
  
  cur.execute(add_comment, data_comment)


