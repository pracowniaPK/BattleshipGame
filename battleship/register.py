from flask import Blueprint, render_template

bp = Blueprint('register', __name__, url_prefix='/')

@bp.route('/')
def register():
	return render_template('register/index.html')

@bp.route('/games_list')
def games_list():
	return render_template('register/games_list.html')

@bp.route('/game_view')
def game_view():
	return render_template('register/game_view.html')

@bp.route('/game_intro_view')
def game_intro_view():
	return render_template('register/game_intro_view.html')