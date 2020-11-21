import socket
import threading
import json
import atexit
from pymongo import MongoClient
from machine_learning.content_based.content_based import ContentBased
from pandas import DataFrame

PORT = 5050
HEADER = 4096  # BITS FOR THE MESSAGE
# SERVER = socket.gethostbyname(socket.gethostname()) # get current ip address
SERVER = "192.168.2.26"
ADDR = (SERVER, PORT)
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(ADDR)
FORMAT = 'utf-8'

client = MongoClient('mongodb+srv://admin-alex:caremada6@cluster0.5inmr.mongodb.net/caremadaDB?retryWrites=true&w=majority')
db = client['caremadaDB']

def start():
    
    
    server.listen()
    print(f"[LISTENING] Server is listening on {SERVER}")
    while True:
        conn, addr = server.accept()
        thread = threading.Thread(target=handle_client, args=(conn, addr))
        thread.start()
        print(f"[ACTIVE CONNECTION] {threading.active_count() - 1}")



''' 
EXPECTED ARGUMENTS FROM REQUESTEE:
"algorithm_t": "content",
"tableName": datasetName,
"pkey_column_name": "_id",
"pkey_val": key
'''
def handle_client(conn, addr):
    print(f"[NEW CONNECTION] {addr} connected.")

    while True:
        msg = conn.recv(HEADER).decode(FORMAT)  # length of the message
        json_msg = json.loads(msg)

        print(type(json_msg))
        print(json_msg)
        
        collection = []
        filter_list = []

        algorithm_t = json_msg['algorithm_t']
        tableName = json_msg['tableName']
        pkey_column_name = json_msg['pkey_column_name']
        pkey_val = json_msg['pkey_val']

        if tableName == "movies":
            collection = db['movies']
            filter_list = [pkey_column_name, "Title", "Genre", "Director", "Actors"]
        else:
            collection = db['caregivers']
            filter_list = [pkey_column_name, "Name", "Occupation", "Services", "Availability", "Location"]

        result = collection.find()
        df = DataFrame(list(result))
        cb = ContentBased(pkey_val, df, filter_list).filter()

        obj = [{ "key1": "7", "key2": "abc" }, { "key1": "8", "key2": "def" }]
    
        conn.send(json.dumps(cb.tolist()).encode(FORMAT))
        # conn.send(str(obj).encode(FORMAT))

        break

    conn.close()


print("[STARTING] server is starting...")
start()

def cleanUp():
    print('web_API.py exiting...')

atexit.register(cleanUp)