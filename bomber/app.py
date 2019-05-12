from flask import Flask

app = Flask(__name__)

@app.route('/hello_world')
def hello_world():
    return 'Boooooooom!'
	
from bomber import register
app.register_blueprint(register.bp)