let chessGame=ChessGame('board');
let chapterRewinder=new Vue({
    el:'#left-menu',
    data:{},
    methods: {
        setMode: function (name) {
        },
        setHandler: function (chapter) {

            switch (chapter) {
                case'b':
                case'n':
                case'k':
                case'r':
                case'q':
                    chessGame.setHandler(pawnsCapturingEventHandler(chapter));
                    chessGame.setMode(oneColorMovesModeWithoutKingControl);
                    break;
                case'p':
                    chessGame.setMode(gameMode);
                    break;
                case'pPromotion':
                    break;
                case 'checking':
                    chessGame.setHandler(checkHandler(true));
                    chessGame.setMode(noOverMode);
                    break;
                case 'defendCheck':
                    chessGame.setHandler(checkHandler(false));
                    chessGame.setMode(noOverMode);
                    break;

            }
            chessGame.handlerInit();
        }
    },
    computed:{}
});
let guideAndTips=new Vue({
    el:'#guide',
    data:{},
    methods:{}
});
function checkHandler(isCheckingSide){
    return {
        checkingSide: isCheckingSide,
        numberOfMoves:0,
        init: function (chessBoard) {
            this.numberOfMoves=0;
            do{
                this.checkPositionGenerator(chessBoard.chess, this.checkingSide);
            }while(chessBoard.chess.moves().length<2);

            if (chessBoard.chess.turn()==='b') {
                PositionManipulator.randomMoveWithCheck(chessBoard.chess);
            }
            chessBoard.refresh();
            console.log(chessBoard.chess.moves());
        },
        update: function (chessBoard, move) {
            this.numberOfMoves++;
            if (!this.checkingSide) {
                PositionManipulator.randomMoveWithCheck(chessBoard.chess);
            }else{
                PositionManipulator.randomMove(chessBoard.chess);
            }
            if(chessBoard.chess.turn()==='b' || this.numberOfMoves===5 || chessBoard.chess.moves().length===0){
                    this.init(chessBoard);
            }
            setTimeout(function () {
                chessBoard.refresh();
            }, 200);
        }, checkPositionGenerator: function (chess, isCheckingSide) {
            chess.clear();
            if(!isCheckingSide)
                PositionManipulator.changeSideOnMove(chess);
            let attackPiece = Math.floor(Math.random() * 2) === 1 ? 'q' : 'r';
            let attackColor = isCheckingSide ? 'w' : 'b';
            let defendColor = attackColor === 'w' ? 'b' : 'w';
            let defendPiece =PositionManipulator.nrToPiece(Math.floor(Math.random()*4)+1);
            PositionManipulator.setPieces(chess, defendPiece, defendColor, [PositionManipulator.getRandomSquare()]);
            PositionManipulator.setPieces(chess, attackPiece, attackColor, [PositionManipulator.getRandomSquare()]);
            let checkingSquares = chess.moves({verbose: true}).map(a => a.to);
            let kingSquare;
            do {
                kingSquare = PositionManipulator.getRandomSquare();
            } while (checkingSquares.includes(kingSquare));
            PositionManipulator.setPieces(chess, 'k', defendColor, [kingSquare]);
        }
    }

}

let pawnHandler={
    init:function(chessBoard){

    },
    update:function(chessBoard,move){

    },generatePawn:function(chess){
        let nrSquare=Math.floor(Math.random()*32)+8;
        let square=PositionManipulator.nrToSquare(nrSquare);
        chess.put(square,{type:'p',color:'w'});
        return square;
    },generatePawnsToCapture(chess,nrSquare) {
        let numberOfPawns = Math.floor(Math.random() * 3);
        if(numberOfPawns===1){
            let pawnSquare;
            let isLeftSide=Math.floor(Math.random()*2)===0;
            if(isLeftSide)
                pawnSquare=nrSquare+7;
            else
                pawnSquare=nrSquare+9;
            chess.put(PositionManipulator.nrToSquare(pawnSquare),{type:'p',color:'b'});
        }else if(numberOfPawns===2){
            chess.put(PositionManipulator.nrToSquare(nrSquare+7),{type:'p',color:'b'});
            chess.put(PositionManipulator.nrToSquare(nrSquare+9),{type:'p',color:'b'});
        }
    }
};


