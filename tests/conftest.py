import pytest

from battleship.app import app, socketio

@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()

    yield client

@pytest.fixture
def socket_client():
    app.config['TESTING'] = True
    client = socketio.test_client(app)

    yield client