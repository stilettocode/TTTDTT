from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import time
import threading
import json
from datetime import datetime

from udp_client import TSSUdpClient
from ai_llm import prompt, waypoint_store, waypoints_get

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading", logger=True, engineio_logger=True)


#tss
TSS_UDP_HOST = "172.22.87.131"

udp_client = TSSUdpClient(TSS_UDP_HOST)

is_running = True

# Latest upstream AI payload as plain text; parse when you add logic.
ai_inbound_raw: str = ""

waypoints_stored: list[tuple[int, float, float, bool]] = []


def fetch_loop():

    # background loop that polls rover telemetry via udp and pushes it over socketio.

    global is_running
    while is_running:
        try:
            rover_data = udp_client.fetch_rover_json()
            rover_data["local_timestamp"] = datetime.now().isoformat()
            socketio.emit("rover-telemetry", rover_data)
            print(f"Fetched rover data: {rover_data}")
            time.sleep(1)

            eva_data = udp_client.fetch_eva_json()
            eva_data["local_timestamp"] = datetime.now().isoformat()
            socketio.emit("eva-telemetry", eva_data)
            print(f"Fetched eva data: {eva_data}")
            time.sleep(1)

            ltv_data = udp_client.fetch_ltv_json()
            ltv_data["local_timestamp"] = datetime.now().isoformat()
            socketio.emit("ltv-telemetry", ltv_data)
            print(f"Fetched ltv data: {ltv_data}")
            time.sleep(1)

            ltv_errors_data = udp_client.fetch_ltv_errors_json()
            ltv_errors_data["local_timestamp"] = datetime.now().isoformat()
            socketio.emit("ltv-errors-telemetry", ltv_errors_data)
            print(f"Fetched ltv errors data: {ltv_errors_data}")
            time.sleep(1)

        except Exception as e:
            error_data = {"error": str(e), "local_timestamp": datetime.now().isoformat()}
            print(f"Error: {error_data}")
            socketio.emit("error", error_data)
        time.sleep(2)


@socketio.on("connect")
def handle_connect():
    print(f"Client connected: {request.sid}")


@socketio.on("disconnect")
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")


@socketio.on("ai")
def handle_ai(data):
    global ai_inbound_raw
    ai_inbound_raw = data if isinstance(data, str) else str(data)
    # basically "if data is a string, set ai_inbound_raw to data, otherwise set it to the string representation of data"
    print(f"AI inbound from {request.sid}: {ai_inbound_raw}")


@socketio.on("waypoint_store")
def handle_waypoint_store(data):
    global waypoints_stored
    waypoints_stored = [(int(r[0]), float(r[1]), float(r[2]), bool(r[3])) for r in data]
    waypoint_store(waypoints_stored)


@socketio.on("waypoints_get")
def handle_waypoints_get():
    waypoints_get()


@app.route("/", methods=["GET", "POST"])
def root():
    return "ok"


if __name__ == "__main__":
    # udp-based fetch loop
    fetch_thread = threading.Thread(target=fetch_loop, daemon=True)
    fetch_thread.start()
    print("Starting Flask + SocketIO server on port 5001")
    socketio.run(app, host="localhost", port=5001)
