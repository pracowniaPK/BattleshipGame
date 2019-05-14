from flask_script import Manager

from battleship.app import app, sio


manager = Manager(app)

@manager.command
def hello():
    print('hello')

@manager.command
def run():
    app.config['DEBUG'] = True
    sio.run(app) 

if __name__ == "__main__":
    manager.run()
