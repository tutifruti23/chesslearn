function pawnsCapturingEventHandler(piece){
    let eventHandler={
        level:3,
        pawnsLeft:0,
        chess:new Chess(),
        update:function(chessBoard){


        },
        init:function(chessBoard){

            generatePositionOneSideCapturing(chessBoard.chess,piece,this.level);
            chessBoard.refresh();
        }
    };
    return eventHandler;
}
function MainHandler(){
    let handler={
        init:function(chessBoard){},
        update:function(chessBoard,move){
            moves.newMove(move.san,chessBoard.board.fen());
        }
    };
    return handler;
}
function generatePositionOneSideCapturing(chess,piece,numberOfPawns){
    chess.clear();
    PositionManipulator.changeSideOnMove(chess);
    let pieceSquare=PositionManipulator.nrToSquare(Math.floor(Math.random()*64));
    PositionManipulator.setPieces(chess,piece,'b',[pieceSquare]);
    let pawns=[];
    while(pawns.length<numberOfPawns){
        let moves=chess.moves({verbose:true});
        let notUsedSquares=[];
        for(let i=0;i<moves.length;i++){
            let nextSquare=moves[i];
            if(!pawns.includes(nextSquare.to) && nextSquare.to !== pieceSquare){
                notUsedSquares.push(nextSquare);
            }
        }
        if(notUsedSquares.length>0){
            let chosenSquare=notUsedSquares[(Math.floor(Math.random()*notUsedSquares.length))];
            pawns.push(chosenSquare.to);
            chess.move(chosenSquare);
            PositionManipulator.changeSideOnMove(chess);
        }else{
            pawns.length=0;
            chess.clear();
            PositionManipulator.setPieces(chess,piece,'w',[pieceSquare]);
        }
    }
    PositionManipulator.setPieces(chess,piece,'w',[pieceSquare]);
    PositionManipulator.setPieces(chess,'p','b',pawns);
    PositionManipulator.changeSideOnMove(chess);
}






