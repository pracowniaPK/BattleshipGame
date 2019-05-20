import random

class Game:
    ''' Game object, keeps current state of game.  
    Board fields states:  
    [0] - nothing  
    [1] - player1 uncovered ship  
    [2] - player2 uncovered ship  
    [3] - player1 destroyed ship  
    [4] - player2 destroyed ship  
    [5] - missed shot
    [6] - ship crash (2 ships on 1 field)
    '''
    def __init__(self, nick, size):
        self.room = ''.join([chr(random.randint(65, 90)) for _ in range(3)])
        self.board = [0]*size**2
        self.size = size
        self.player1 = nick
        self.player2 = None
        self.round = None
        self.won = None

    def connect_player2(self, nick):
        self.player2 = nick

    def setup(self, board):
        if [x for x in self.board if x != 0]:
            ... 
        else:
            self.board = board

    def shot(self, x, y):
        ...
