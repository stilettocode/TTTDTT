from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import time
import threading
import json
from datetime import datetime

from udp_client import TSSUdpClient

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading", logger=True, engineio_logger=True)

#tss
TSS_UDP_HOST = "172.21.220.116"

udp_client = TSSUdpClient(TSS_UDP_HOST)

is_running = True

# Latest upstream AI payload as plain text; parse when you add logic.
ai_inbound_raw: str = ""

waypoints_stored: list[tuple[int, float, float, bool]] = []

# Latest "matrix" payload from clients (2D int array); updated on each emit.
matrix_stored: list[list[int]] = []


def fetch_loop():

    # background loop that polls rover telemetry via udp and pushes it over socketio.

    global is_running
    while is_running:
        try:
            rover_data = udp_client.fetch_rover_json()
            rover_data["local_timestamp"] = datetime.now().isoformat()
            socketio.emit("rover-telemetry", rover_data)
            print(f"Fetched rover data: {rover_data}")
            time.sleep(0.5)

            eva_data = udp_client.fetch_eva_json()
            eva_data["local_timestamp"] = datetime.now().isoformat()
            socketio.emit("eva-telemetry", eva_data)
            print(f"Fetched eva data: {eva_data}")
            time.sleep(0.5)

            ltv_data = udp_client.fetch_ltv_json()
            ltv_data["local_timestamp"] = datetime.now().isoformat()
            socketio.emit("ltv-telemetry", ltv_data)
            print(f"Fetched ltv data: {ltv_data}")
            time.sleep(0.5)

            ltv_errors_data = udp_client.fetch_ltv_errors_json()
            ltv_errors_data["local_timestamp"] = datetime.now().isoformat()
            socketio.emit("ltv-errors-telemetry", ltv_errors_data)
            print(f"Fetched ltv errors data: {ltv_errors_data}")
            time.sleep(0.5)

            socketio.emit("matrix-sync", matrix_stored)
            print(f"Matrix sync: {matrix_stored}")
            time.sleep(0.5)

        except Exception as e:
            error_data = {"error": str(e), "local_timestamp": datetime.now().isoformat()}
            print(f"Error: {error_data}")
            socketio.emit("error", error_data)

        time.sleep(0.5)


@socketio.on("connect")
def handle_connect():
    print(f"Client connected: {request.sid}")


@socketio.on("disconnect")
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")


@socketio.on("matrix")
def handle_matrix(data):
    global matrix_stored
    matrix_stored = data


@socketio.on("rover-throttle")
def handle_rover_throttle(data):
    udp_client.set_throttle(float(data))


@socketio.on("rover-steering")
def handle_rover_steering(data):
    udp_client.set_steering(float(data))


@socketio.on("rover-brakes")
def handle_rover_brakes(data):
    udp_client.set_brakes(bool(data))


@socketio.on("rover-heating")
def handle_rover_heating(data):
    udp_client.set_heating(float(data))


@socketio.on("rover-cooling")
def handle_rover_cooling(data):
    udp_client.set_cooling(float(data))


@socketio.on("rover-headlights")
def handle_rover_headlights(data):
    udp_client.set_headlights(float(data))


@socketio.on("rover-ping")
def handle_rover_ping(data=None):
    udp_client.send_ping(1.0 if data is None else float(data))


@socketio.on("rover-debug-ping")
def handle_rover_debug_ping(data=None):
    udp_client.send_debug_ping(1.0 if data is None else float(data))


@app.route("/", methods=["GET", "POST"])
def root():
    return "ok"


if __name__ == "__main__":
    # udp-based fetch loop
    fetch_thread = threading.Thread(target=fetch_loop, daemon=True)
    fetch_thread.start()
    print("Starting Flask + SocketIO on 0.0.0.0:5001 (LAN clients use this host's IP)")
    socketio.run(app, host="0.0.0.0", port=5001)
