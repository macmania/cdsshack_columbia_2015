from flask import Flask, request, send_from_directory
from flask import render_template
from flask_s3 import Flasks3

app = Flask(__name__, static_url_path='')
app.config['S3_BUCKET_NAME'] = 'organ-donation-data-viz'

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/bower_components/<path:path>')
def send_bower(path): 
	return send_from_directory('bower_components', path)

@app.route('/js/<path:path>')
def send_js(path): 
	return send_from_directory('js', path)

if __name__ == '__main__':
    app.run()