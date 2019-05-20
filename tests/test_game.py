from battleship.game import Game

def test_sanity_check():
    game = Game('test_nick', 12)
    assert type(game) is Game

def test_setup():
    game = Game('test_nick', 3)

    p1_board = [0, 0, 0, 1, 1, 1, 0, 0, 0]
    game.setup(p1_board)
    assert game.board == [0, 0, 0, 1, 1, 1, 0, 0, 0]

    p2_board = [0, 2, 0, 0, 2, 0, 0, 2, 0]
    game.connect_player2('test_nick2')
    game.setup(p2_board)
    assert game.board == [0, 2, 0, 1, 6, 1, 0, 2, 0]
    assert game.player1 == 'test_nick'
    assert game.player2 == 'test_nick2'
    assert game.round != None

def test_shot():
    game = Game('test_nick', 3)
    game.board = [0, 2, 0, 1, 6, 1, 0, 2, 0]
    game.round = 1

    game.shot(0, 0)
    assert game.board == [5, 2, 0, 1, 6, 1, 0, 2, 0]
    assert game.round == 2

    game.shot(0, 1)
    assert game.board == [5, 2, 0, 3, 6, 1, 0, 2, 0]
    assert game.round == 1

    game.shot(1, 0)
    assert game.board == [5, 4, 0, 3, 6, 1, 0, 2, 0]
    assert game.round == 2
    assert game.won == None

    game.shot(1, 2)
    assert game.board == [5, 4, 0, 3, 6, 3, 0, 2, 0]
    assert game.won == 2

