import psycopg2
from psycopg2.extras import DictCursor

conn = psycopg2.connect("dbname=oakland user=postgres")
conn.autocommit = True

cur = conn.cursor(cursor_factory=DictCursor)
cur.execute('select * from temp_count')
record_table = cur.fetchall()

#print record_table[0].keys()
for record in record_table:

    print record
    sql = "update alameda set violation_count = %s where facility_name = %s"

    ##print record['ogc_fid']
    #print sql




    cur.execute(sql,(record[1],record[0]))

