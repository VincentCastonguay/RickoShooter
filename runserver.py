import http.server
import socketserver
import webbrowser

PORT = 8000

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        print(f"Serving: {self.path}")
        if self.path.endswith('.js'):
            print("→ Forcing MIME type: application/javascript")
            self.send_header('Content-Type', 'application/javascript')
        super().end_headers()

def run():
    with socketserver.TCPServer(("127.0.0.1", PORT), MyHandler) as httpd:
        print(f"Serving game at http://localhost:{PORT}")
        webbrowser.open(f"http://localhost:{PORT}")
        httpd.serve_forever()

if __name__ == "__main__":
    run()
