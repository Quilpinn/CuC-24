from flask import Flask, jsonify, Response, request, send_from_directory
from flask_cors import CORS, cross_origin
import mysql.connector, logging, random, string, os, sys, json, hashlib
from mysql.connector import errors
import mail

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

    return ''.join(''.join(random.choices(string.ascii_lowercase + string.digits, k=length)) for length in segments)

def find_user_id_by_hash(connection, hash):
    cursor = connection.cursor()
    
    try:
        username_hash, password_hash = hash.split(":")
    except ValueError:
        return None

    query = "SELECT UUID FROM Users WHERE SHA2(USERNAME, 256) = %s AND SHA2(PASSWORD, 256) = %s"

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
    query = "CREATE TABLE IF NOT EXISTS Users (UUID VARCHAR(255) NOT NULL, USERNAME VARCHAR(255) UNIQUE NOT NULL, EMAIL VARCHAR(255) UNIQUE NOT NULL, PASSWORD VARCHAR(4000) NOT NULL, CITY VARCHAR(255), INTERESTS VARCHAR(400), VERIFIED INT NOT NULL, CREATED_AT DATETIME DEFAULT CURRENT_TIMESTAMP)"
    query2 = "CREATE TABLE IF NOT EXISTS Posts (PID INT AUTO_INCREMENT PRIMARY KEY, CONTENT_TYPE VARCHAR(255) NOT NULL, HEADING VARCHAR(2000), CONTENT VARCHAR(10000) NOT NULL, PICTURE_URL VARCHAR(255), TIMESTAMP DATETIME DEFAULT CURRENT_TIMESTAMP, CREATED_BY_UUID VARCHAR(255) NOT NULL, EVENT_QID VARCHAR(255))"
    query3 = "CREATE TABLE IF NOT EXISTS Events (QEID VARCHAR(255), IEID INT AUTO_INCREMENT PRIMARY KEY, CITY VARCHAR(255), EVENT_DATE VARCHAR(255), CREATED_BY_UUID VARCHAR(255), PARTICIPANTS VARCHAR(2000))"
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
    data = request.json

    try:
        connection = create_connection()
        cursor = connection.cursor()

        posts_query = """
            SELECT 
                p.PID, p.CONTENT_TYPE, p.HEADING, p.CONTENT, p.PICTURE_URL, 
                p.TIMESTAMP, p.CREATED_BY_UUID, p.EVENT_QID, u.USERNAME 
            FROM 
                Posts p
            LEFT JOIN 
                Users u 
            ON 
                p.CREATED_BY_UUID = u.UUID
            ORDER BY 
                p.TIMESTAMP DESC
        """
        cursor.execute(posts_query)
        posts = cursor.fetchall()

        post_columns = [col[0] for col in cursor.description]

        if not posts:
            logger.warning("No posts in feed found.")
            close_connection(connection)
            return jsonify({"status": "No posts found"}), 404

        event_ids = [post[7] for post in posts if post[7]]

        events_map = {}
        if event_ids:
            placeholders = ",".join(["%s"] * len(event_ids))
            events_query = f"SELECT QEID, CITY, EVENT_DATE, CREATED_BY_UUID, PARTICIPANTS FROM Events WHERE QEID IN ({placeholders})"
            cursor.execute(events_query, tuple(event_ids))
            events = cursor.fetchall()

            events_map = {
                event[0]: {
                    "USERNAME": event[3],
                    "QEID": event[0],
                    "CITY": event[1],
                    "EVENT_DATE": event[2],
                    "CREATED_BY_UUID": str(event[3]),
                    "PARTICIPANTS": event[4] or "",
                }
                for event in events
            }

        posts_with_events = []
        for post in posts:
            post_dict = dict(zip(post_columns, post))
            post_event_qid = post[7]

            if post_event_qid in events_map:
                post_dict["event_details"] = events_map[post_event_qid]

            posts_with_events.append(post_dict)

        close_connection(connection)

        return jsonify({"posts": posts_with_events}), 200

    except Exception as e:
        logger.error(f"Error retrieving feed: {e}")
        if 'connection' in locals():
            close_connection(connection)
        return jsonify({"status": "An error occurred while retrieving the feed"}), 500

# TODO: Docker compose file mapping for correct directory
# @app.route('/cdn/<path:path>')
# def serve_content(path):
#     return send_from_directory('reports', path)

@app.route(base_path + "/users/get", methods=["POST"])
def get_user():
    data = request.json

    username = data["username"]

    connection = create_connection()
    cursor = connection.cursor()

    query = "SELECT USERNAME, INTERESTS, CITY FROM Users WHERE USERNAME = %s"

    cursor.execute(query, (username,))

    res = cursor.fetchone()

    if res is None:
        return jsonify({"error": "User not found"}), 404

    user_data = {
        "username": res[0],
        "interests": res[1],
        "city": res[2]
    }

    return jsonify(user_data), 200


@app.route(base_path + "/posts/create", methods=["POST"])
def create_post():
    data = request.json

    heading = data["heading"]
    content = data["content"]
    hash_cookie = data["hash"]
    event_id = data["eventId"]

    connection = create_connection()
    
    uuid = find_user_id_by_hash(connection, hash_cookie)

    cursor = connection.cursor()

    query = "INSERT INTO Posts (CONTENT_TYPE, HEADING, CONTENT, PICTURE_URL, CREATED_BY_UUID, EVENT_QID) VALUES (%s, %s, %s, %s, %s, %s)"

    cursor.execute(query, ("post", heading, content, str("null"), str(uuid), event_id))
    connection.commit()
    close_connection(connection)

    return Response(status=201)

@app.route(base_path + "/events/create", methods=["POST"])
def create_event():
    data = request.json

    heading = data["heading"]
    content = data["content"]
    city = data["city"]
    event_time = data["time"]
    event_date = data["date"]
    hash_cookie = data["hash"]

    connection = create_connection()
    
    try:
        uuid = find_user_id_by_hash(connection, hash_cookie)
        event_u_id = generate_uuid()
        cursor = connection.cursor()

        query1 = "INSERT INTO Posts (CONTENT_TYPE, HEADING, CONTENT, PICTURE_URL, CREATED_BY_UUID, EVENT_QID) VALUES (%s, %s, %s, %s, %s, %s)"
        query2 = "INSERT INTO Events (QEID, CITY, EVENT_DATE, CREATED_BY_UUID) VALUES (%s, %s, %s, %s)"

        cursor.execute(query1, ("event", str(heading), str(content), None, str(uuid), str(event_u_id)))
        cursor.execute(query2, (str(event_u_id), str(city), f"{event_date} {event_time}", str(uuid)))
        connection.commit()
    except Exception as e:
        connection.rollback()
        raise e
    finally:
        close_connection(connection)

    return Response(status=201)

@app.route(base_path + "/events/get", methods=["POST"])
def get_events_by_id():
    data = request.json

    event_id = data.get("eventId")

    if not event_id:
        return jsonify({"error": "eventId is required"}), 400

    connection = create_connection()
    cursor = connection.cursor()

    query_events = "SELECT CITY, EVENT_DATE, PARTICIPANTS FROM Events WHERE QEID = %s"
    cursor.execute(query_events, (event_id,))
    res_events = cursor.fetchone()

    if not res_events:
        return jsonify({"error": "Event not found"}), 404

    query_posts = "SELECT HEADING, CONTENT, PICTURE_URL FROM Posts WHERE EVENT_QID = %s"
    cursor.execute(query_posts, (event_id,))
    res_posts = cursor.fetchone()

    if not res_posts:
        res_posts = [None, None, None]

    map = {
        "HEADING": res_posts[0],
        "CONTENT": res_posts[1],
        "PICTURE_URL": res_posts[2],
        "CITY": res_events[0],
        "TIMESTAMP": res_events[1],
        "PARTICIPANTS": res_events[2]
    }

    return jsonify(map), 200

@app.route(base_path + "/events/participate", methods=["POST"])
def add_participant_to_event():
    data = request.json

    connection = create_connection()
    cursor = connection.cursor()

    query = "SELECT PARTICIPANTS FROM Events WHERE QEID = %s"
    cursor.execute(query, (data["eventId"],))
    res = cursor.fetchone()
    
    if res is None:
        return Response("Event not found", status=404)

    current_participants = res[0] if res[0] else ""
    hash_cookie = data["hash"]
    uuid = find_user_id_by_hash(connection, hash_cookie)
    
    query2 = "SELECT USERNAME FROM Users WHERE UUID = %s"
    cursor.execute(query2, (uuid,))
    res_username = cursor.fetchone()

    if res_username is None:
        return Response("User not found", status=404)

    username = res_username[0]

    participants_list = current_participants.split(';') if current_participants else []
    if username not in participants_list:
        participants_list.append(username)

    updated_participants = ";".join(participants_list)
    
    query3 = "UPDATE Events SET PARTICIPANTS = %s WHERE QEID = %s"
    cursor.execute(query3, (updated_participants, data["eventId"]))

    connection.commit()

    return Response(status=204)

@app.route(base_path + "/users/create", methods=["POST"])
def create_user():
    data = request.json
    
    connection = create_connection()
    cursor = connection.cursor()

    email = data["email"]
    password = generate_sha256(data["password"])
    
    interests_json = json.dumps(data["interests"])
    
    line = (generate_uuid(), data["username"], email, password, data["city"], interests_json, 0)

    query = "INSERT INTO Users (UUID, USERNAME, EMAIL, PASSWORD, CITY, INTERESTS, VERIFIED) VALUES (%s, %s, %s, %s, %s, %s, %s)"

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
@cross_origin(supports_credentials=True)
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