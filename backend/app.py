from flask import Flask, jsonify, Response, request
from flask_cors import CORS, cross_origin
import mysql.connector, logging, random, string
from mysql.connector import Error
import hashlib

logger = logging.getLogger("backend-app-logger")

app = Flask(__name__)
CORS(app, support_credentials=True)

base_path = "/api/v1/"

def generate_sha512(password):
    hashed_password = hashlib.sha512(password.encode('utf-8')).hexdigest()
    print(hashed_password)

def generate_uuid():
    segments = [8, 8, 8, 8]

    return '-'.join(''.join(random.choices(string.ascii_lowercase + string.digits, k=length)) for length in segments)

def create_connection():
    try:
        connection = mysql.connector.connect(host='cuc-24-db-1', database='data', user='root', password='A4432468432456432432')

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
    query = "CREATE TABLE IF NOT EXISTS Users (UUID VARCHAR(255) NOT NULL, USERNAME VARCHAR(255) UNIQUE NOT NULL, EMAIL VARCHAR(255) UNIQUE NOT NULL, PASSWORD VARCHAR(255) NOT NULL, VERIFIED INT NOT NULL, CREATED_AT DATETIME DEFAULT CURRENT_TIMESTAMP)"
    query2 = "CREATE TABLE IF NOT EXISTS Posts (PID INT AUTO_INCREMENT PRIMARY KEY, HEADING VARCHAR(2000), CONTENT VARCHAR(10000) NOT NULL, PICTURE_URL VARCHAR(255), TIMESTAMP DATETIME NOT NULL)"
    cursor.execute(query)
    cursor.execute(query2)
    connection.commit()
    close_connection(connection)

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
    close_connection(connection)

    if res == []:
        logger.warning("No posts in feed found.")
        return Response(status=200)

    return Response(status=200)

@app.route(base_path + "/posts/create", methods=["POST"])
def create_post():
    return Response(status=500)

@app.route(base_path + "/users/create", methods=["POST"])
@cross_origin(supports_credentials=True)
def create_user():
    data = request.json
    
    connection = create_connection()
    cursor = connection.cursor()

    email = data["email"]
    
    line = (generate_uuid(), data["username"], email, str(generate_sha512((data["password"]))), 0)
    print(line)

    try:
        query = "INSERT INTO Users (UUID, USERNAME, EMAIL, PASSWORD, VERIFIED) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, line)
        connection.commit()

    except Exception:
        return jsonify({"message": "Error"}), 500

    return jsonify({"message": "ok"}), 201

@app.route(base_path + "/authenticate", methods=["POST"])
def authenticate_user():
    data = request.json

    connection = create_connection()
    cursor = connection.cursor()

    username = data["username"]
    password = generate_sha512((data["password"]))

    query = "SELECT * FROM Users WHERE username = %s AND password = %s"
    cursor.execute(query, (username, password))
    user = cursor.fetchone()

    if user:
        return jsonify({"message": "ok", "hash": "123"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

if __name__ == '__main__':
    create_tables()
    app.run(host="0.0.0.0", port=8484, threaded=True)