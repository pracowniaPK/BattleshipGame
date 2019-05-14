from flask import Flask, g, render_template, redirect, request, url_for
from flask_socketio import SocketIO, emit


app = Flask(__name__)
sio = SocketIO(app)
ROOMS = {}

@app.route('/')
def register():
	return render_template('register/index.html')

@app.route('/games_list', methods=['GET', 'POST'])
def games_list():
	if request.method == 'POST':
		g.nick = request.form['nick']
		return render_template('register/games_list.html', nick=g.nick, rooms=ROOMS)
	else:
		return redirect(url_for('register.register'))

@app.route('/game_view')
def game_view():
	return render_template('register/game_view.html')
