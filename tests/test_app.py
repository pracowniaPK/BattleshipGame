def test_register(client):
    rv = client.get('/')
    assert b'Your nick' in rv.data

def test_games_list(client):
    rv = client.get('/games_list', follow_redirects=True)
    assert b'Your nick' in rv.data

    rv = client.post('/games_list', data=dict(nick='test_nick'))
    print(rv.data)
    assert b'test_nick' in rv.data
