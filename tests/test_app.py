import json

from flask import g

def test_register(client):
    rv = client.get('/')
    assert b'Your nick' in rv.data

def test_games_list(client):
    rv = client.get('/games_list', follow_redirects=True)
    assert b'Your nick' in rv.data

    rv = client.post('/games_list', data=dict(nick='test_nick'))
    print(rv.data)
    assert b'test_nick' in rv.data

def test_sanity_socket(socket_client):
    socket_client.emit('join', {'room':'nope', 'nick':'test_nick'})
    rv = socket_client.get_received()
    assert rv[0]['args'] == 'there is no room nope'

def test_create(client, socket_client):
    socket_client.emit('create', {'nick':'test_nick', 'size':12})
    rv = socket_client.get_received()
    print(rv)
    data = json.loads(rv[0]['args'][0])
    assert rv[0]['name'] == 'game_update'
    assert data['size'] == 11
    assert data['board'] == [0]*11**2
    assert data['player1'] == 'test_nick'
    