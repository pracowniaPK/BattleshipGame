from flask import Blueprint, render_template

bp = Blueprint('register', __name__, url_prefix='/')

@bp.route('/')
def register():
	return render_template('register/index.html')