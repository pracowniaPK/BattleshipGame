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
		print(g.nick)
	try:
		# TODO odfiltrować pełne gry
		return render_template('register/games_list.html', nick=g.nick, rooms=ROOMS.values())
	except AttributeError as _:
		return redirect(url_for('register'))

@app.route('/game_view', methods=['POST'])
def game_view():
	room = request.form['room']
	nick = request.form['nick']
	return render_template('register/game_intro_view.html', nick=nick, room=room)

@app.route('/game')
def game():
	return render_template('register/game_view.html')

@socketio.on('create')
def on_create(date):
	nick = date['nick']
	new_game = Game(nick, 11)
	room = new_game.room
	ROOMS[room] = new_game
	join_room(room)
	# emit('game_update', ROOMS[room].to_json(), room=room)
	return new_game.to_json()

@socketio.on('join')
def on_join(data):
	room = data['room']
	nick = data['nick']
	print(room, nick)
	if room in ROOMS and ROOMS[room].player2 == None:
		ROOMS[room].player2 = nick
		join_room(room)
		#send('player {} joined'.format(nick), room=room)
		emit('game_update', ROOMS[room].to_json(), room=room)
	elif room in ROOMS:
		send('room is ful')
	else:
		send('there is no room {}'.format(room))

@socketio.on('get_game')
def on_get_game(room):
	return ROOMS[room].to_json()

@socketio.on('setup')
def on_setup(data):
	room = data['room']
	obj = data['board'].split(',')
	# room.setup(data['board'], data['nick'])
	ROOMS[room].setup(obj)
	if room.ready:
		emit('game_update', ROOMS[room].to_json(), room=room)

@socketio.on('shot')
def on_shot(data):
	x = int(data['x'])
	y = int(data['y'])
	room = data['room']
	ROOMS[room].shot(x, y)
	emit('game_update', ROOMS[room].to_json(), room=room)
	