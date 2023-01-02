let chessBoardModeSelector = function (el, chessboard) {
  new Vue({
    el: el,
    methods: {
      setMode: function (name) {
        switch (name) {
          case 'legalMovesMode': {
            chessboard.setMode(gameMode);
            break;
          }
          case 'freeMode': {
            chessboard.setMode(freeMode);
            break;
          }
          case 'oneSideMovesMode': {
            chessboard.setMode(oneColorMovesMode);
            break;
          }
          case 'spareMode': {
            chessboard.setMode(spareMode);
            break;
          }
          case 'setPos': {
            chessboard.setPosition('rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2');
            break;
          }
          case 'engineMode': {
            chessboard.setMode(engineMode);
            break;
          }
          case 'puzzleMode': {
            chessboard.setMode(puzzleMode);
            break;
          }
        }
      },
    },
  });
};
let chessGame = ChessGame('board');
chessBoardModeSelector('#selector', chessGame);
