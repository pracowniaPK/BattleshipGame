from flask import Flask, g, render_template, redirect, request, url_for
from flask_socketio import SocketIO, emit, join_room, send

from .game import Game


app = Flask(__name__)
socketio = SocketIO(app)
ROOMS = {}

@app.route('/')
def register():
	return render_template('register/index.html')

@app.route('/games_list', methods=['GET', 'POST'])
def games_list():
	if request.method == 'POST':
		g.nick = request.form['nick']
	try:
		return render_template('register/games_list.html', nick=g.nick, rooms=ROOMS)
	except AttributeError as _:
		return redirect(url_for('register'))

@app.route('/game_view')
def game_view():
	return render_template('register/game_view.html')

@socketio.on('create')
def on_create(date):
	nick = date['nick']
	new_game = Game(nick, date['size'])
	room = new_game.room
	ROOMS[room] = new_game
	join_room(room)
	emit('game_update', ROOMS[room].to_json(), room=room)

@socketio.on('join')
def on_join(data):
	room = data['room']
	if room in ROOMS and ROOMS[room].player2 == None:
		ROOMS[room].player2 = g.nick
		join_room(room)
		send('player {} joined'.format(g.nick), room=room)
		emit('game_update', ROOMS[room].to_json(), room=room)
	elif room in ROOMS:
		send('room is ful')
	else:
		send('there is no room {}'.format(room))

@socketio.on('setup')
def on_setup(data):
	room = data['room']
	room.setup(data['board'], data['nick'])
	if room.ready:
		emit('game_update', ROOMS[room].to_json(), room=room)

@socketio.on('shot')
def on_shot(data):
	x = int(data['x'])
	y = int(data['y'])
	room = data['room']
	ROOMS[room].shot(x, y)
	emit('game_update', ROOMS[room].to_json(), room=room)
