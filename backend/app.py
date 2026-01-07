from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import requests
import time
import threading
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading', logger=True, engineio_logger=True)

TSS_URL = "http://172.21.220.116:14141/json_data/teams/0/TELEMETRY.json"
is_running = True

def fetch_loop():
    global is_running
    while is_running:
        try:
            response = requests.get(TSS_URL, timeout=5.0)
            response.raise_for_status()
            data = response.json()
            data['local_timestamp'] = datetime.now().isoformat()
            socketio.emit('telemetry', data)
        except Exception as e:
            error_data = {'error': str(e), 'local_timestamp': datetime.now().isoformat()}
            socketio.emit('error', error_data)
        time.sleep(2)

@socketio.on('connect')
def handle_connect():
    print(f"Client connected: {request.sid}")

@socketio.on('disconnect')
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")

if __name__ == '__main__':
    # Start fetch loop
    fetch_thread = threading.Thread(target=fetch_loop, daemon=True)
    fetch_thread.start()
    
    print("Starting Flask + SocketIO server on port 5001")
    socketio.run(app, host='0.0.0.0', port=5001)
