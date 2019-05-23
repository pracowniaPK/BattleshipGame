import random
import json

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

    def to_json(self):
        return json.dumps(self.__dict__)

    def connect_player2(self, nick):
        self.player2 = nick

    def setup(self, board):
        if [x for x in self.board if x != 0]:
            for i in range(len(self.board)):
                if(self.board[i] == 1 and board[i] == 2):
                    self.board[i] = 6
                elif(board[i] == 2):
                    self.board[i] = 2
                if(self.board[i] == 1 and board[i] == 2):
                    self.board[i] = 6
            self.round = random.randint(1,2)
        else:
            self.board = board

    def shot(self, x, y):
        ind = self.size * y + x
        if self.board[ind] == 0:
            self.board[ind] = 5
        elif self.board[ind] == 1:
            self.board[ind] = 3
        elif self.board[ind] == 2:
            self.board[ind] = 4

        if not 1 in self.board:
            self.won = 2
        elif not 2 in self.board:
            self.won = 1

        if self.round == 1:
            self.round = 2
        else:
            self.round = 1
