#import socket and do rover commands
#shoot into telementar amd get json to see fi changes made, check if brakes are included in json thats spitted out 
#use telementry host and port number
#while running have a loop that keeps chaning the values and sending them to the telementary and keep getting the json to make sure that it correctly returns, 
#include print statements to print the json 

import socket
import time
from udp_client import TSSUdpClient

def testing(host = '172.17.78.98', port = 14141):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            sock.connect((host, port))
            print(f"Conncted to {host}:{port}")
            #send command to set brakes
            udp = TSSUdpClient(host, port)
            while True:
                udp.set_brakes(True)
                udp.set_throttle(99.9)
                udp.set_steering(0.8)
                udp.set_cabin_heating(0.5)
                udp.set_cabin_cooling(0.5)
                udp.set_headlights(0.5)
                udp.set_LTV_ping(0.5)
                udp.set_LTV_ping_unlimited(0.5)
                print(f"The data nshi: {udp.fetch_rover_json()}")
                time.sleep(5)
                udp.set_brakes(False)
                udp.set_throttle(-99.9)
                udp.set_steering(-0.8)
                udp.set_cabin_heating(0.0)
                udp.set_cabin_cooling(0.0)
                udp.set_headlights(0.0)
                udp.set_LTV_ping(0.0)
                udp.set_LTV_ping_unlimited(0.0)
                print(f"The data nshi: {udp.fetch_rover_json()}")
                time.sleep(5)
    except Exception as e:
        print(f"Error is: {e}")
if __name__ == "__main__":
    testing()