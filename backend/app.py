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
TSS_UDP_HOST = "172.22.40.21"

udp_client = TSSUdpClient(TSS_UDP_HOST)

is_running = True

# Latest metric warning alerts received from Socket.IO clients.
metric_warnings_stored: list[dict] = []
latest_matrix_update: dict | None = None


def _extract_command_value(data, keys=("value",), default=None):
    if isinstance(data, dict):
        for key in keys:
            if key in data:
                return data[key]
        return default

    if data is None:
        return default

    return data


def _emit_udp_command_error(event_name: str, error: str):
    error_data = {
        "command": event_name,
        "error": error,
        "local_timestamp": datetime.now().isoformat(),
    }
    print(f"UDP command {event_name} error: {error_data}")
    emit("udp-command-error", error_data)


def _parse_float_command_value(event_name: str, data, default: float) -> float | None:
    try:
        return float(_extract_command_value(data, default=default))
    except (TypeError, ValueError):
        _emit_udp_command_error(event_name, "command value must be numeric")
        return None


def _parse_bool_command_value(event_name: str, data, default: bool) -> bool | None:
    value = _extract_command_value(data, keys=("engaged", "value"), default=default)
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return bool(value)
    if isinstance(value, str):
        normalized = value.strip().lower()
        if normalized in ("true", "1", "yes", "on"):
            return True
        if normalized in ("false", "0", "no", "off"):
            return False

    _emit_udp_command_error(event_name, "command value must be boolean")
    return None


def _emit_udp_command_result(event_name: str, command_func, value=None):
    try:
        result = command_func() if value is None else command_func(value)
        result["local_timestamp"] = datetime.now().isoformat()
        print(f"UDP command {event_name} result: {json.dumps(result)}")
        emit("udp-command-result", result)
        socketio.emit(f"{event_name}-result", result)
    except Exception as e:
        _emit_udp_command_error(event_name, str(e))


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
    if metric_warnings_stored:
        emit("metric-warning", metric_warnings_stored)
    if latest_matrix_update:
        emit("matrix-update", latest_matrix_update)


@socketio.on("disconnect")
def handle_disconnect():
    print(f"Client disconnected: {request.sid}")


@socketio.on("voiceString")
def handle_voice_string(data):
    voice_string = str(data)
    print(f"Voice string received: {voice_string}")
    socketio.emit("voiceString", voice_string)


@socketio.on("set_brakes")
def handle_set_brakes(data=None):
    engaged = _parse_bool_command_value("set_brakes", data, default=False)
    if engaged is None:
        return
    _emit_udp_command_result("set_brakes", udp_client.set_brakes, engaged)


@socketio.on("set_throttle")
def handle_set_throttle(data=None):
    value = _parse_float_command_value("set_throttle", data, default=0.0)
    if value is None:
        return
    _emit_udp_command_result("set_throttle", udp_client.set_throttle, value)


@socketio.on("set_steering")
def handle_set_steering(data=None):
    value = _parse_float_command_value("set_steering", data, default=0.0)
    if value is None:
        return
    _emit_udp_command_result("set_steering", udp_client.set_steering, value)


@socketio.on("set_heating")
def handle_set_heating(data=None):
    value = _parse_float_command_value("set_heating", data, default=0.0)
    if value is None:
        return
    _emit_udp_command_result("set_heating", udp_client.set_heating, value)


@socketio.on("set_cooling")
def handle_set_cooling(data=None):
    value = _parse_float_command_value("set_cooling", data, default=0.0)
    if value is None:
        return
    _emit_udp_command_result("set_cooling", udp_client.set_cooling, value)


@socketio.on("set_headlights")
def handle_set_headlights(data=None):
    value = _parse_float_command_value("set_headlights", data, default=0.0)
    if value is None:
        return
    _emit_udp_command_result("set_headlights", udp_client.set_headlights, value)


@socketio.on("send_ping")
def handle_send_ping(data=None):
    value = _parse_float_command_value("send_ping", data, default=1.0)
    if value is None:
        return
    _emit_udp_command_result("send_ping", udp_client.send_ping, value)


@socketio.on("send_debug_ping")
def handle_send_debug_ping(data=None):
    value = _parse_float_command_value("send_debug_ping", data, default=1.0)
    if value is None:
        return
    _emit_udp_command_result("send_debug_ping", udp_client.send_debug_ping, value)


@socketio.on("metric-warning")
def handle_metric_warning(data):
    global metric_warnings_stored

    alerts = data if isinstance(data, list) else [data]
    timestamped_alerts = []
    for alert in alerts:
        if not isinstance(alert, dict):
            print(f"Ignoring invalid metric-warning payload: {alert}")
            continue

        normalized_alert = {
            **alert,
            "local_timestamp": alert.get("local_timestamp", datetime.now().isoformat()),
        }
        timestamped_alerts.append(normalized_alert)

    if not timestamped_alerts:
        return

    metric_warnings_stored = (timestamped_alerts + metric_warnings_stored)[:5]
    print(f"Metric warning received: {json.dumps(timestamped_alerts)}")
    socketio.emit("metric-warning", timestamped_alerts)


@socketio.on("matrix-update")
def handle_matrix_update(data):
    global latest_matrix_update

    if not isinstance(data, dict):
        emit("error", {"error": "matrix-update payload must be an object"})
        return

    matrix = data.get("data")
    top_left = data.get("topleft")
    if not isinstance(matrix, list) or not all(isinstance(row, list) for row in matrix):
        emit("error", {"error": "matrix-update data must be a matrix array"})
        return

    if (
        not isinstance(top_left, dict)
        or not isinstance(top_left.get("x"), (int, float))
        or not isinstance(top_left.get("y"), (int, float))
    ):
        emit("error", {"error": "matrix-update topleft must include numeric x and y"})
        return

    latest_matrix_update = {
        "data": matrix,
        "topleft": {
            "x": top_left["x"],
            "y": top_left["y"],
        },
        "local_timestamp": data.get("local_timestamp", datetime.now().isoformat()),
    }
    print(f"Matrix update received: {json.dumps(latest_matrix_update)}")
    socketio.emit("matrix-update", latest_matrix_update)


@app.route("/", methods=["GET", "POST"])
def root():
    return "ok"


if __name__ == "__main__":
    # udp-based fetch loop
    fetch_thread = threading.Thread(target=fetch_loop, daemon=True)
    fetch_thread.start()
    print("Starting Flask + SocketIO server on port 5001")
    socketio.run(app, host="localhost", port=5001)
