from flask import Flask, jsonify, Response
import mysql.connector, logging
from mysql.connector import Error

logger = logging.getLogger("backend-app-logger")

app = Flask(__name__)

base_path = "/api/v1/"

def create_connection():
    try:
        connection = mysql.connector.connect(host='127.0.0.1', database='data', user='root', password='A4432468432456432432')

        if connection.is_connected():
            print("Connected to MySQL database")
            logger.debug("Connected to mysql")
            return connection
    except Error as e:
        print(f"Error creating connection: {e}")
        logger.critical(f"Error creating mysql connection: {e}")
        return None

def close_connection(connection):
    if connection.is_connected():
        connection.close()
        print("Connection closed")
        logger.debug("Connection to mysql closed")

def create_tables():
    connection = create_connection()
    cursor = connection.cursor()
    query = "CREATE TABLE IF NOT EXISTS Users (UUID VARCHAR(255) NOT NULL, USERNAME VARCHAR(255) NOT NULL, EMAIL VARCHAR(255) NOT NULL, PASSWORD VARCHAR(255) NOT NULL, VERIFIED INT NOT NULL, CREATED_AT DATETIME NOT NULL)"
    query2 = "CREATE TABLE IF NOT EXISTS Posts (PID INT AUTO_INCREMENT PRIMARY KEY, HEADING VARCHAR(2000), CONTENT VARCHAR(10000) NOT NULL, PICTURE_URL VARCHAR(255), TIMESTAMP DATETIME NOT NULL)"
    cursor.execute(query)
    cursor.execute(query2)

@app.route(base_path, methods=["GET", "POST"])
def base_path_route():
    return Response(status=200)

@app.route(base_path + "feed", methods=["GET"])
def get_and_return_feed():
    connection = create_connection()
    cursor = connection.cursor()
    query = "SELECT * FROM Posts ORDER BY TIMESTAMP DESC"

    cursor.execute(query)
    res = cursor.fetchall()
    print(res)

    if res == []:
        logger.warning("No posts in feed found.")
        return Response(status=200)

    return Response(status=200)

@app.route(base_path + "/posts/create", methods=["POST"])
def create_post():
    return Response(status=500)

@app.route(base_path + "/users/create", methods=["POST"])
def create_user():
    

    return Response(status=201)

if __name__ == '__main__':
    create_tables()
    app.run(host="0.0.0.0", threaded=True)
