import argparse
import random
import time

import socketio


DEFAULT_URL = "http://127.0.0.1:5001"
DEFAULT_WIDTH = 500
DEFAULT_HEIGHT = 300
DEFAULT_INTERVAL_SECONDS = 1.0


def build_matrix(width: int, height: int) -> list[list[int]]:
    return [
        [random.randint(0, 5) for _ in range(width)]
        for _ in range(height)
    ]


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Continuously send random matrix-update payloads to the Socket.IO backend.",
    )
    parser.add_argument("--url", default=DEFAULT_URL, help=f"Socket.IO backend URL. Default: {DEFAULT_URL}")
    parser.add_argument("--width", type=int, default=DEFAULT_WIDTH, help=f"Matrix columns. Default: {DEFAULT_WIDTH}")
    parser.add_argument("--height", type=int, default=DEFAULT_HEIGHT, help=f"Matrix rows. Default: {DEFAULT_HEIGHT}")
    parser.add_argument(
        "--interval",
        type=float,
        default=DEFAULT_INTERVAL_SECONDS,
        help=f"Seconds between emits. Default: {DEFAULT_INTERVAL_SECONDS}",
    )
    args = parser.parse_args()

    sio = socketio.Client()

    @sio.event
    def connect():
        print(f"Connected to {args.url}")

    @sio.event
    def disconnect():
        print("Disconnected")

    sio.connect(args.url)

    try:
        count = 0
        while True:
            matrix = build_matrix(args.width, args.height)
            sio.emit("matrix-update", matrix)
            count += 1
            print(f"Sent matrix #{count}: {args.width}x{args.height}")
            time.sleep(args.interval)
    except KeyboardInterrupt:
        print("Stopping matrix sender")
    finally:
        sio.disconnect()


if __name__ == "__main__":
    main()
