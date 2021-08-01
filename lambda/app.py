import psycopg2
import sys
import logging
import rds_config

rds_host = os.environ.get("db_host")
db_username = os.environ.get("db_username")
db_password = os.environ.get("db_password")
db_name = os.environ.get("db_name")

logger = logging.getLogger()
logger.setLevel(logging.INFO)

# PostgreSQL Connection
try: 
    conn = psycopg2.connect(database=db_name, user=db_username,
                       password=db_password, port=5432,
                       host=rds_host)
except psycopg2.Error as e:
    logger.error("ERROR")
    logger.error(e)
    sys.exit()

logger.info("SUCCESS: Connection to RDS Postgresql instance succeeded")
def handler(event, context):

    with conn.cursor() as cur:
        cur.execute("SELECT * FROM hospitals")
        for row in cur:
            print(row)

handler(None, None)