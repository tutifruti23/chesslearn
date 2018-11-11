function  gameMode(chessGame,isAllowOnlyOneSideMode,noOverMode){
    let pos=chessGame.chess.fen();
    let color=chessGame.chess.turn();
    let onDragStart = function(source, piece, position, orientation) {
        if ((chessGame.chess.game_over() === true && !noOverMode) ||
            (chessGame.chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (chessGame.chess.turn() === 'b' && piece.search(/^w/) !== -1) || (isAllowOnlyOneSideMode && chessGame.chess.turn()!==color )) {
            return false;
        }
    };
    let onDrop = function(source, target) {
        let move = chessGame.chess.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });
        if (move === null) return 'snapback';
        if(move.flags.includes('p')){
            chessGame.chess.undo();
            promotionDialog(chessGame,function(piece){
                move = chessGame.chess.move({
                    from: source,
                    to: target,
                    promotion: piece // NOTE: always promote to a queen for example simplicity
                });
                chessGame.refresh();
                chessGame.handlerUpdate(move);
            });

        }else{
            chessGame.handlerUpdate(move);
        }
    };
// update the board position after the piece snap
// for castling, en passant, pawn promotion
    let onSnapEnd = function() {
        chessGame.board.position(chessGame.chess.fen());
    };
    return{
        draggable: true,
        position: pos,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
}
function allowOnlyOneSideMode(chessGame){
    return gameMode(chessGame,true);
}
function freeMode(){
    return{
        draggable: true,
        position: 'start'
    };
}
function spareMode(chessGame){
    let onChange= function(oldPos,newPos) {
        chessGame.handlerUpdate(ChessBoard.objToFen(newPos))
    };
    return {
        draggable: true,
        dropOffBoard: 'trash',
        sparePieces: true,
        onChange:onChange,
    };
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
        if (move === null) return 'snapback';
        if(move.flags.includes('p')){
            chessGame.chess.undo();
            promotionDialog(chessGame,function(piece){
                move = chessGame.chess.move({
                    from: source,
                    to: target,
                    promotion: piece // NOTE: always promote to a queen for example simplicity
                });

                PositionManipulator.changeSideOnMove(chessGame.chess);
            });
        }
        else{
            PositionManipulator.changeSideOnMove(chessGame.chess);
        }
    };
// update the board position after the piece snap
// for castling, en passant, pawn promotion
    let onSnapEnd = function() {
        chessGame.board.position(chessGame.chess.fen());
    };
    return {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
}
function oneColorMovesModeWithoutKingControl(){
    let tempChess=new Chess();
    let onDragStart = function(source, piece, position, orientation) {
        if (
            (chessGame.chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (chessGame.chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    };
    let onDrop = function(source, target) {
        // see if the move is legal

        let piece=chessGame.chess.get(source);
        if(piece.type==='k'){
            tempChess.clear();
            tempChess.put(piece,source);
            let controlMove=tempChess.move({
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });
            if(controlMove!==null){
                chessGame.chess.remove(source);
                chessGame.chess.put(piece,target);
                chessGame.handlerUpdate(controlMove);
            }else{
                return 'snapback';
            }
        }else{
            let move = chessGame.chess.move({
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });
            if (move === null) return 'snapback';
            if(move.flags.includes('p')){
                chessGame.chess.undo();
                promotionDialog(chessGame,function(piece){
                    move = chessGame.chess.move({
                        from: source,
                        to: target,
                        promotion: piece // NOTE: always promote to a queen for example simplicity
                    });
                    chessGame.refresh();
                    PositionManipulator.changeSideOnMove(chessGame.chess);
                    chessGame.handlerUpdate(move);
                });
            }else{
                PositionManipulator.changeSideOnMove(chessGame.chess);
                chessGame.handlerUpdate(move);
            }

        }
    };
// update the board position after the piece snap
// for castling, en passant, pawn promotion
    let onSnapEnd = function() {
        chessGame.board.position(chessGame.chess.fen());
    };
    return {
        draggable: true,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
}
function engineMode(chessGame){
    engine=STOCKFISH();
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
        if(move.flags.includes('p')){
            chessGame.chess.undo();
            promotionDialog(chessGame,function(piece){
                move = chessGame.chess.move({
                    from: source,
                    to: target,
                    promotion: piece // NOTE: always promote to a queen for example simplicity
                });
                chessGame.refresh();
                window.setTimeout(makeRandomMove, 100);
            });
        }else{
            window.setTimeout(makeRandomMove, 100);
        }
        // make random legal move for black

    };

// update the board position after the piece snap
// for castling, en passant, pawn promotion
    let onSnapEnd = function() {
        chessGame.board.position(chessGame.chess.fen());
    };
    return {
        draggable: true,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
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

    return {
        draggable: true,
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
}
function noOverMode(chessGame){
    return gameMode(chessGame,false,true);

}
let  promotionDialog=function(chessGame,callback){
    function createPieceElem(piece,color){
        let $elem=$( '<div class="p-2  promotionPiece"><img class="align-middle img-thumbnail " src="images/chesspieces/wikipedia/'+color+piece+'.png"/></div>');
        $elem.on('click',function () {
            callback(piece);
            elem.remove();
        });
        return $elem ;
    }
    let id=chessGame.boardId;
    let $parent=$('#'+id).parent();
    let width=$parent.width();
    let color=chessGame.chess.turn();
    let $flex=$('<div class="d-flex justify-content-center"></div>');
    $flex.append(createPieceElem('Q',color));
    $flex.append(createPieceElem('R',color));
    $flex.append(createPieceElem('B',color));
    $flex.append(createPieceElem('N',color));
    let elem=$('<div class="promotionDialog container">' +
        '</div>');
    elem.append($flex);
    elem.width(width);
    elem.height(width);
    elem.css({marginTop:-width});
    $parent.append(elem);
};