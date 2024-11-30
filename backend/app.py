from flask import Flask, jsonify, Response, request, send_from_directory
from flask_cors import CORS, cross_origin
import mysql.connector, logging, random, string, os
from mysql.connector import errors
import hashlib

logger = logging.getLogger("backend-app-logger")
frontend_url = os.getenv("FRONTEND_URL")

app = Flask(__name__)
CORS(app, support_credentials=True, resources={r"/*": {"origins": [frontend_url]}})

base_path = "/api/v1/"

def generate_sha256(password):
    hashed_password = hashlib.sha256(password.encode('utf-8')).hexdigest()
    return hashed_password

def generate_uuid():
    segments = [8, 8, 8, 8]

    return '-'.join(''.join(random.choices(string.ascii_lowercase + string.digits, k=length)) for length in segments)

def find_user_id_by_hash(connection, hash):
    cursor = connection.cursor()
    
    try:
        username_hash, password_hash = hash.split(":")
    except ValueError:
        return None

    query = "SELECT UUID, USERNAME, CITY FROM Users WHERE SHA2(USERNAME, 256) = %s AND SHA2(PASSWORD, 256) = %s"

    cursor.execute(query, (username_hash, password_hash))

    res = cursor.fetchone()
    return res[0] if res else None

def find_user_by_username(connection, username):
    cursor = connection.cursor()

    query = "SELECT UUID FROM Users WHERE USERNAME = %s"

    cursor.execute(query, (username,))

    res = cursor.fetchone()

    if res:
        return res
    else:
        return None

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
    query = "CREATE TABLE IF NOT EXISTS Users (UUID VARCHAR(255) NOT NULL, USERNAME VARCHAR(255) UNIQUE NOT NULL, EMAIL VARCHAR(255) UNIQUE NOT NULL, PASSWORD VARCHAR(4000) NOT NULL, CITY VARCHAR(255), VERIFIED INT NOT NULL, CREATED_AT DATETIME DEFAULT CURRENT_TIMESTAMP)"
    query2 = "CREATE TABLE IF NOT EXISTS Posts (PID INT AUTO_INCREMENT PRIMARY KEY, CONTENT_TYPE VARCHAR(255) NOT NULL, HEADING VARCHAR(2000), CONTENT VARCHAR(10000) NOT NULL, PICTURE_URL VARCHAR(255), TIMESTAMP DATETIME DEFAULT CURRENT_TIMESTAMP, CREATED_BY_UUID VARCHAR(255) NOT NULL, EVENT_QID VARCHAR(255))"
    query3 = "CREATE TABLE IF NOT EXISTS Events (QEID VARCHAR(255), IEID INT AUTO_INCREMENT PRIMARY KEY, CITY VARCHAR(255), EVENT_ADDRESS VARCHAR(600), TIMESTAMP DATETIME DEFAULT CURRENT_TIMESTAMP, CREATED_BY_UUID VARCHAR(255), PARTICIPANTS VARCHAR(2000))"
    cursor.execute(query)
    cursor.execute(query2)
    cursor.execute(query3)
    connection.commit()
    close_connection(connection)

@app.route(base_path, methods=["GET", "POST"])
def base_path_route():
    return Response(status=200)

@app.route(base_path + "feed", methods=["POST"])
def get_and_return_feed():
    try:
        connection = create_connection()
        cursor = connection.cursor()
        
        query = "SELECT * FROM Posts ORDER BY TIMESTAMP DESC"
        cursor.execute(query)

        columns = [col[0] for col in cursor.description]
        res = cursor.fetchall()

        if not res:
            logger.warning("No posts in feed found.")
            close_connection(connection)
            return jsonify({"status": "No posts found"}), 404

        posts = [dict(zip(columns, row)) for row in res]

        close_connection(connection)
        return jsonify({"posts": posts}), 200

    except Exception as e:
        logger.error(f"Error retrieving feed: {str(e)}")
        return jsonify({"status": "An error occurred while retrieving the feed"}), 500

# TODO: Still need to improve it. https://stackoverflow.com/questions/20646822/how-to-serve-static-files-in-flask
# @app.route("cdn/", methods=["GET"])
# def serve_images():
#     return send_from_directory('pictures', path)

# TODO: Implement user and posting finding/searching for profile page
@app.route(base_path + "/users/get", methods=["POST"])
def get_user():
    data = request.json
    
    connection = create_connection()
    cursor = connection.cursor()

    user = find_user_by_username(connection, data["username"])

    query = "SELECT USERNAME FROM Users WHERE UUID = %s"

    query_posts = ""

    cursor.execute(query, (user[0],))
    res = cursor.fetchone()

    return Response(res)

@app.route(base_path + "/posts/create", methods=["POST"])
def create_post():
    data = request.json

    heading = data["heading"]
    content = data["content"]
    hash_cookie = data["hash"]

    connection = create_connection()
    
    uuid = find_user_id_by_hash(connection, hash_cookie)

    cursor = connection.cursor()

    query = "INSERT INTO Posts (CONTENT_TYPE, HEADING, CONTENT, PICTURE_URL, CREATED_BY_UUID) VALUES (%s, %s, %s, %s, %s)"

    cursor.execute(query, ("post", heading, content, str("null"), uuid[0]))
    connection.commit()
    close_connection(connection)

    return Response(status=201)

@app.route(base_path + "/events/create", methods=["POST"])
def create_event():
    data = request.json

    heading = data["heading"]
    content = data["content"]
    event_address = data["event_address"]
    hash_cookie = data["hash"]

    connection = create_connection()
    
    uuid = find_user_id_by_hash(connection, hash_cookie)

    cursor = connection.cursor()

    event_u_id = generate_uuid()

    query1 = "INSERT INTO Posts (CONTENT_TYPE, HEADING, CONTENT, PICTURE_URL, CREATED_BY_UUID, EVENT_QID) VALUES (%s, %s, %s, %s, %s, %s)"
    query2 = "INSERT INTO Events (QEID, CITY, EVENT_ADDRESS, CREATED_BY_UUID) VALUES (%s, %s, %s, %s)"

    cursor.execute(query1, ("event", heading, content, str("null"), uuid, event_u_id))
    cursor.execute(query2, (event_u_id, uuid[2], event_address, uuid))
    connection.commit()
    close_connection(connection)

    return Response(status=201)

@app.route(base_path + "/users/create", methods=["POST"])
@cross_origin(supports_credentials=True)
def create_user():
    data = request.json
    
    connection = create_connection()
    cursor = connection.cursor()

    email = data["email"]
    password = generate_sha256(data["password"])
    
    line = (generate_uuid(), data["username"], email, password, 0)

    query = "INSERT INTO Users (UUID, USERNAME, EMAIL, PASSWORD, VERIFIED) VALUES (%s, %s, %s, %s, %s)"

    try:
        cursor.execute(query, line)
        connection.commit()
        close_connection(connection)
        return jsonify({"status": "ok"}), 201
    except errors.IntegrityError as e:
        if e.errno == 1062:
            return jsonify({"status": "Der Benutzername oder die E-Mail Adresse exsistiert bereits in der Datenbank. Bitte wähle andere."}), 400
        else:
            return jsonify({"status": "Ein Fehler ist in der Datenverarbeitung aufgetreten."}), 500

    return jsonify({"status": "Ein unerwarteter Fehler ist aufgetreten!"}), 500

@app.route(base_path + "/authenticate", methods=["POST"])
def authenticate_user():
    data = request.json

    connection = create_connection()
    cursor = connection.cursor()

    password = generate_sha256(data["password"])
    username = data["username"]

    query = "SELECT * FROM Users WHERE username = %s AND password = %s"
    cursor.execute(query, (username, password))
    user = cursor.fetchone()
    print(user)

    close_connection(connection)

    user_cookie = generate_sha256(username) + ":" + generate_sha256(password)
    
    if user:
        return jsonify({"status": "ok", "hash": user_cookie}), 200
    else:
        return jsonify({"status": "Der Benutzername oder das Passwort ist falsch."}), 401

if __name__ == '__main__':
    create_tables()
    app.run(host="0.0.0.0", port=8484, threaded=True)