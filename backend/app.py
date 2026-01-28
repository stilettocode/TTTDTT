from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import requests
import time
import threading
import json
from typing import List, Dict
from datetime import datetime

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading', logger=True, engineio_logger=True)

BASE_URL = "http://127.0.0.1:8080/json_data"


is_running = True

def emit_message(filename : str, label: str):
    response = requests.get(BASE_URL + filename, timeout=5.0)
    response.raise_for_status()
    data = response.json()
    data['local_timestamp'] = datetime.now().isoformat()
    socketio.emit(label, data)

with open("./files.json", "r") as file:
    data = json.load(file)

def fetch_loop():
    global is_running
    while is_running:
        try:
            for file in data:
                emit_message(file["filename"], file["label"])
        except Exception as e:
            error_data = {'error': str(e), 'local_timestamp': datetime.now().isoformat()}
            print(f"Error: {error_data}")
            socketio.emit('error', error_data)
        time.sleep(2)

@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")

@socketio.on('disconnect')
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")

@app.route('/', methods=['GET', "POST"])
def root():
    return "ok"


if __name__ == '__main__':
    # Start fetch loop
    fetch_thread = threading.Thread(target=fetch_loop, daemon=True)
    fetch_thread.start()
    print("Starting Flask + SocketIO server on port 5001")
    socketio.run(app, host='localhost', port=5001)
