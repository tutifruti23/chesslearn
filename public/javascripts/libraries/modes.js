function  gameMode(chessGame){
    let onDragStart = function(source, piece, position, orientation) {
        if (chessGame.chess.game_over() === true ||
            (chessGame.chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (chessGame.chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    };
    let onDrop = function(source, target) {
        // see if the move is legal
        let move = chessGame.chess.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });
        // illegal move
        if (move === null) return 'snapback';

    };

// update the board position after the piece snap
// for castling, en passant, pawn promotion
    let onSnapEnd = function() {
        chessGame.board.position(chessGame.chess.fen());
    };
    let cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
    return cfg;
}
function freeMode(){
    let cfg = {
        draggable: true,
        position: 'start'
    };
    return cfg;
}
function spareMode(chessGame){
    let onChange= function(oldPos,newPos) {
        chessGame.handlerUpdate(ChessBoard.objToFen(newPos))
    };


    const cfg = {
        draggable: true,
        dropOffBoard: 'trash',
        sparePieces: true,
        onChange:onChange,

    };
    return cfg;
}
function oneColorMovesMode(chessGame){
    let onDragStart = function(source, piece, position, orientation) {
        if (
            (chessGame.chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (chessGame.chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    };
    let onDrop = function(source, target) {
        // see if the move is legal
        let move = chessGame.chess.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });
        // illegal move
        if (move === null) return 'snapback';
        else{
            PositionManipulator.changeSideOnMove(chessGame.chess);
        }
    };

// update the board position after the piece snap
// for castling, en passant, pawn promotion
    let onSnapEnd = function() {
        chessGame.board.position(chessGame.chess.fen());
    };
    let cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
    return cfg;
};
function engineMode(chessGame){

    function uciCmd(cmd) {
        engine.postMessage(cmd);
    }
    uciCmd('uci');
// do not pick up pieces if the game is over
// only pick up pieces for White
    let onDragStart = function(source, piece, position, orientation) {
        if ( chessGame.chess.in_checkmate() === true || chessGame.chess.in_draw() === true ||
            piece.search(/^b/) !== -1) {
            return false;
        }
    };
    engine.onmessage = function(event) {

        let match = event.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
        if(match)
            chessGame.chess.move({from: match[1], to: match[2], promotion: match[3]});
        chessGame.board.position( chessGame.chess.fen());
    };
    let makeRandomMove = function() {
        uciCmd("position fen "+ chessGame.chess.fen());
        uciCmd("go depth 15");
    };
    let onDrop = function(source, target) {
        // see if the move is legal
        let move =  chessGame.chess.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });
        // illegal move
        if (move === null) return 'snapback';
        // make random legal move for black
        window.setTimeout(makeRandomMove, 100);
    };

// update the board position after the piece snap
// for castling, en passant, pawn promotion
    let onSnapEnd = function() {
        chessGame.board.position(chessGame.chess.fen());
    };
    let cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
    return cfg;
}
function puzzleMode(chessGame){
    let color=chessGame.chess.turn();
    let onDragStart = function(source, piece, position, orientation) {
        if (chessGame.chess.game_over() === true ||
            (chessGame.chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (chessGame.chess.turn() === 'b' && piece.search(/^w/) !== -1) ||
             chessGame.chess.turn() !== color  )
            {
            return false;
        }
    };
    let onDrop = function(source, target) {
        // see if the move is legal
        let move = chessGame.chess.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });
        // illegal move
        if (move === null) return 'snapback';

    };

// update the board position after the piece snap
// for castling, en passant, pawn promotion
    let onSnapEnd = function() {
        chessGame.board.position(chessGame.chess.fen());
    };

    let cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
    return cfg;
}