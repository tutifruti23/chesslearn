userController = {
  initInfo: function (user) {
    settings.readyForNextPuzzles = true;
    settings.nextPuzzle();
    userAndPuzzleData.setUserLogin(true, user.displayName);
    setDataWithToken(function (token) {
      getUserRating(token);
    });
  },
  logout: function () {
    userAndPuzzleData.setUserLogin(false);
    settings.readyForNextPuzzles = true;
    settings.nextPuzzle();
    userAndPuzzleData.rating = '?';
  },
};

let loadPuzzle = function () {
  settings.loading = true;
  setDataWithToken(function (token) {
    let path = token === null ? '/solvePuzzle/newRandomPuzzle' : '/solvePuzzle/newPuzzleUser';
    $.post(
      path,
      {
        token: token,
      },
      function (result) {
        settings.loading = false;
        settings.readyForNextPuzzles = true;
        if (result) {
          userAndPuzzleData.puzzleData = result;
          changeToPuzzleMode();
          chessGame.setPosition(result.fen);
          NotationMethods.arrayMovesToListMoves(result.fen, settings.listMoves, result.solution);
          settings.playerColor = chessGame.chess.turn();
        } else {
          userAndPuzzleData.displayInfo('Something goes wrong', false);
        }
      }
    );
  });
};
let setScore = function (score) {
  setDataWithToken(function (token) {
    $.post(
      'solvePuzzle/solvePuzzle',
      {
        score: score,
        token: token,
        puzzleId: userAndPuzzleData.puzzleData.id,
        docId: userAndPuzzleData.puzzleData.docId,
      },
      function (data) {
        userAndPuzzleData.rating = data.rating;
      }
    );
  });
};
function getUserRating(token) {
  $.post(
    'solvePuzzle/getRating',
    {
      token: token,
    },
    function (data) {
      userAndPuzzleData.rating = data.rating;
    }
  );
}

let userAndPuzzleData = new Vue({
  el: '#userAndPuzzleData',
  data: {
    rating: '?',
    solved: 0,
    unsolved: 0,
    puzzleData: undefined,
    successText: false,
    info: '',
    userLogin: false,
    loginInfo: '',
  },
  methods: {
    increaseCounter: function (isGood) {
      if (isGood) this.solved++;
      else this.unsolved++;
    },
    getPuzzleId: function () {
      return this.puzzleData === undefined ? '?' : '#' + this.puzzleData.id;
    },
    getPuzzleRating: function () {
      return this.puzzleData === undefined ? '?' : this.puzzleData.rating;
    },
    getPuzzleAttempts: function () {
      return this.puzzleData === undefined ? '?' : this.puzzleData.attempts;
    },
    displayInfo: function (text, isSuccessText) {
      clearTimeout(this.timeout);
      this.successText = isSuccessText;
      this.info = text;
      let handler = this;
      this.timeout = setTimeout(function () {
        handler.info = '';
      }, 6000);
    },
    setUserLogin: function (isLogin, userName) {
      this.userLogin = isLogin;
      this.loginInfo = isLogin ? 'Logged as ' + userName : 'You are not logged in, your progress will not be save!';
    },
  },
});

let puzzleHandler = {
  init: function () {
    console.log('puzzle');
    settings.listMoves.disableKeysNavigation();
  },
  update: function (chessboard, move) {
    settings.listMoves.next();
    if (move.san === settings.listMoves.current.move) {
      if (settings.listMoves.hasNextMoves()) {
        setTimeout(function () {
          settings.listMoves.next();
          chessboard.setPosition(settings.listMoves.current.position);
          if (!settings.listMoves.hasNextMoves()) changeToReview(true);
        }, 200);
      } else {
        changeToReview(true);
      }
    } else changeToReview(false);
  },
};
function changeToReview(isOk) {
  userAndPuzzleData.increaseCounter(isOk);
  settings.lastScore = isOk;
  settings.reviewMode = true;
  chessGame.setHandler(reviewHandler);
  chessGame.setMode(gameMode);

  settings.listMoves.setListener(function (move) {
    chessGame.setPosition(move.position);
  });
  chessGame.handlerInit();
  setScore(isOk ? 1 : -1);
}
function changeToPuzzleMode() {
  settings.reviewMode = false;
  chessGame.setHandler(puzzleHandler);
  settings.listMoves.setListener(null);
  chessGame.handlerInit();
}
let reviewHandler = {
  init: function () {
    console.log('review');
    settings.listMoves.enableKeysNavigation();
    settings.reviewMode = true;
  },
  update: function (chessBoard, move) {
    settings.listMoves.newMove(move.san, chessBoard.chess.fen());
  },
};
let chessGame = ChessGame('board');
chessGame.setPosition(PositionManipulator.getEmptyBoardFen());
chessGame.setMode(gameMode);
chessGame.setHandler(puzzleHandler);
let settings = new Vue({
  el: '#settings',
  data: {
    listMoves: NotationMethods.newListMoves(PositionManipulator.getStartFen()),
    userLogged: '',
    reviewMode: true,
    lastScore: true,
    playerColor: '',
    readyForNextPuzzles: false,
    loading: true,
  },
  methods: {
    nextPuzzle: function () {
      if (this.readyForNextPuzzles) {
        this.readyForNextPuzzles = false;
        loadPuzzle();
      }
    },
    getListMoves: function () {
      return this.listMoves.getNotation();
    },
    giveUp: function () {
      changeToReview(false);
    },
    getInfoImagePath() {
      if (this.reviewMode) {
        return 'img/basics/' + (this.lastScore ? 'good' : 'bad') + '.png';
      } else {
        return 'img/chesspieces/wikipedia/' + (this.playerColor === 'b' ? 'b' : 'w') + 'R.png';
      }
    },
    getInfoText() {
      let res;
      if (this.reviewMode) {
        res = this.lastScore ? 'Correct!' : 'Puzzle failed.';
      } else {
        res = (this.playerColor === 'w' ? 'white' : 'black') + ' to move';
      }
      return res;
    },
  },
});
