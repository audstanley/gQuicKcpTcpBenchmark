import socket
import sys
from time import sleep
TCP_IP = '127.0.0.1'
TCP_PORT = 8389
BUFFER_SIZE = 20  # Normally 1024, but we want fast response
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.bind((TCP_IP, TCP_PORT))
s.listen(10)

conn, addr = s.accept()
print('Connection address:', addr)
while True:
    try:

        data = conn.recv(BUFFER_SIZE)
        if data:
            print("received data:", data)
    except KeyboardInterrupt:
        print("closing connection")
        conn.close()
        sys.exit()
    # conn.send(data)  # echo
    # conn.close()
