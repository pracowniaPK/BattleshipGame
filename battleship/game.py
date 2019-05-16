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
    '''
    def __init__(self, nick, size):
        self.room = ''.join([chr(random.randint(65, 90)) for _ in range(3)])
        self.board = [[0]*size]*size
        self.size = size
        self.player1 = nick
        self.player2 = None
        self.round = None
        self.player1_setup_ready = False
        self.player2_setup_ready = False
        self.ready = False

    def setup(self, board):
        if self.player1_setup_ready or self.player2_setup_ready:
            ... 
        else:
            self.board = board

    def shot(self):
        ...
