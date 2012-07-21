import psycopg2
from psycopg2.extras import DictCursor

conn = psycopg2.connect("dbname=oakland user=postgres")
conn.autocommit = True

cur = conn.cursor(cursor_factory=DictCursor)
cur.execute('select * from alameda')
record_table = cur.fetchall()

#print record_table[0].keys()
for record in record_table:

    address = record['location'].split('(')[0]
    latitude = record['location'].split('(')[1].split(',')[0]
    longitude = record['location'].split('(')[1].split(',')[1].split(')')[0].lstrip()
    #print "ogc_fid: " + str(record['ogc_fid']) + " position: " + str(record['location'])

#    sql = "update alameda set geom = geomfromtext('POINT(' || %s || ' ' || %s || ')', 4326) where ogc_fid = %d;" % (longitude, latitude, record['ogc_fid'])
#
#    print record['ogc_fid']
#    print sql
#
#    try:
#        cur.execute(sql)
#    except Exception, e:
#        pass

    sql = "update alameda set address = geomfromtext('POINT(' || %s || ' ' || %s || ')', 4326) where ogc_fid = %d;" % (longitude, latitude, record['ogc_fid'])

    print record['ogc_fid']
    print sql

    try:
        cur.execute(sql)
    except Exception, e:
        pass

