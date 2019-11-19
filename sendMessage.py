import socket
from time import sleep
import sys

TCP_IP = "127.0.0.1"
TCP_PORT = 8389
BUFFER_SIZE = 1024

c = 1
while True:
    m = "Hello world: " + str(c)
    MESSAGE = bytes(m, "utf-8")
    sys.stdout.write("sending...")
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.connect((TCP_IP, TCP_PORT))
        s.send(MESSAGE)
        s.close()
    except:
        sys.stdout.write("err")
        try:
            s.close()
        except:
            pass
    sys.stdout.write("\n")
    sleep(1)
    c += 1
