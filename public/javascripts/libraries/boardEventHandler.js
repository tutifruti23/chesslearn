function pawnsCapturingEventHandler(piece){
    let eventHandler={
        level:1,
        pawnsLeft:0,
        levelAccepted:true,
        update:function(chessBoard){

            let numberOfPawns=0;
            for(let i=0;i<64;i++){
                let piece=chessBoard.chess.get(PositionManipulator.nrToSquare(i))
                if(piece!==null && piece.color==='b'){
                    numberOfPawns++;
                }
            }
            if(numberOfPawns===this.pawnsLeft && numberOfPawns>0){
                this.levelAccepted=false;
            }else{
                this.pawnsLeft--;
            }
            if(numberOfPawns===0){
                if(this.levelAccepted && this.level<7)
                    this.level++;
                else if(!this.levelAccepted && this.level>1){
                    this.level--;
                }
                this.init(chessBoard);
            }

        },
        init:function(chessBoard){
            this.pawnsLeft=this.level;
            this.levelAccepted=true;
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
    let tempChess=new Chess();
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
        if(pawns.length===numberOfPawns && piece!=='k' && piece!== 'n'){
            tempChess.clear();
            PositionManipulator.setPieces(tempChess,piece,'w',[pieceSquare]);
            PositionManipulator.setPieces(tempChess,'p','b',pawns);
            let currentSquare=pieceSquare;
            let move;
            for(let i=0;i<pawns.length;i++){
                move=tempChess.move({
                    from: currentSquare,
                    to:pawns[i],
                    promotion: 'q' // NOTE: always promote to a queen for example simplicity
                });
                currentSquare=pawns[i];
                PositionManipulator.changeSideOnMove(tempChess);
                if(move===null){
                    pawns.length=0;
                    break;
                }

            }
        }
    }
    PositionManipulator.setPieces(chess,piece,'w',[pieceSquare]);
    PositionManipulator.setPieces(chess,'p','b',pawns);
    PositionManipulator.changeSideOnMove(chess);
}






