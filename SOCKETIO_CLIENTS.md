# Socket.IO 

This backend runs **Flask-SocketIO** on **TCP port 5001**, bound to **all interfaces** (`0.0.0.0`). 

## Connect

**URL:** `http://<BACKEND_HOST_IP>:5001`

### Example

```python
import socketio
import threading
import time
from flask_socketio import SocketIO, emit

sio = socketio.Client()
is_running = True

@sio.event
def connect():
    print("connected", sio.sid)

@sio.event
def disconnect():
    print("disconnected")

@sio.on("rover-telemetry")
def on_rover(data):
    print("rover ok")

@sio.on("ltv-telemetry")
def on_ltv(data):
    print("ltv ok")

sio.connect("http://127.0.0.1:5001")
try:
    sio.emit("set_throttle", 100.0)
    print("emit ok")
except Exception as e:
    print(f"Error sending rover throttle: {e}")
sio.wait()
```

Note that the try: and except: aren't actually necessary, just nice to have. It can easily be:

```python
sio.emit("set_throttle", 100.0) 
```

On its own. Or,

```python
if (case):
    sio.emit("set_throttle", 100.0)
```

Register handlers with `@sio.on("<event_name>")` for each server event you care about.

---

## TSS rover / status controls (`udp_client.py`)


`set_brakes(engaged: bool)` | 1107

`set_throttle(value: float)` | 1109  

`set_steering(value: float)` | 1110  

`set_heating(value: float)` | 1103  

`set_cooling(value: float)` | 1104  

`set_headlights(value: float)` | 1106  

`send_ping(value=1.0)` | 2050  

`send_debug_ping(value=1.0)` | 2051  


Telemetry pulls (used by the server loop, not typical client emits): `fetch_rover_json` (0), `fetch_eva_json` (1), `fetch_ltv_json` (2), `fetch_ltv_errors_json` (3).

Read **NASA’s TSS** docs for full JSON field meanings

---

## From server to you <3

`rover-telemetry` | JSON object + `local_timestamp` (ISO)  

`ltv-telemetry` | JSON object + `local_timestamp`  

`ltv-errors-telemetry` | JSON object + `local_timestamp`  

`eva-telemetry` | JSON object + `local_timestamp`  

`metric-warning` | Latest warning alert object/list + `local_timestamp`; also sent on connect if stored  

`matrix-update` | Latest 2D matrix array; also sent on connect if stored  

`voiceString` | Echoed voice string  

`udp-command-result` | UDP command result sent back to the requesting client  

`<command>-result` | UDP command result broadcast to all clients, such as `set_throttle-result`  

`udp-command-error` | `{"command": str, "error": str, "local_timestamp": str}` sent back to the requesting client  

`error` | `{"error": str, "local_timestamp": str}`  

`matrix-update` is the 2D matrix for navigation/display on the frontend. It is stretched to fit the map overlay. Shape:

```python
[[0, 1], [2, 3]]
```

---

## From you to server.

Use **`sio.emit(event, data)`**; payloads must be JSON or Python objects

`set_throttle` | Single float, or `{"value": float}`  

`set_steering` | Single float, or `{"value": float}`  

`set_brakes` | Boolean, or `{"engaged": bool}` / `{"value": bool}`  

`set_heating` | Single float (0…1), or `{"value": float}`  

`set_cooling` | Single float (0…1), or `{"value": float}`  

`set_headlights` | Single float (0…1), or `{"value": float}`  

`send_ping` | Optional float, defaults to `1.0`  

`send_debug_ping` | Optional float, defaults to `1.0`  

`matrix-update` | 2D array, such as `[[0, 1], [2, 3]]`  

`metric-warning` | Warning alert object or list of objects  

`task` | One JSON array, or 5 separate args; stored as 5 strings  

`voiceString` | String; echoed back to all clients  

Examples:

```python
sio.emit("set_throttle", 10.0)
sio.emit("set_steering", {"value": -0.2})
sio.emit("set_brakes", {"engaged": False})
sio.emit("set_heating", 0.5)
sio.emit("set_cooling", 0.0)
sio.emit("set_headlights", 1.0)
sio.emit("send_ping")
sio.emit("send_debug_ping", 1.0)
sio.emit("matrix-update", [[0, 1], [2, 3]])
sio.emit("task", ["", "", "", "", ""])
sio.emit("voiceString", "hello")
```
