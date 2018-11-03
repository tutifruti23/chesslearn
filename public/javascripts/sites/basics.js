let chessGame=ChessGame('board');
let guideAndTips;
let chapterRewinder=new Vue({
    el:'#left-menu',
    data:{},
    methods: {
        setMode: function (name) {
        },
        setHandler: function (chapter,dataIndex) {

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
                    chessGame.setHandler(pawnHandler);
                    chessGame.setMode(noOverMode);
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
                case 'enPassant':
                    chessGame.setHandler(enPassantHandler);
                    chessGame.setMode(noOverMode);
                    break;

            }
            chessGame.handlerInit();
            guideAndTips.setData(data[dataIndex]);
        }
    },
    computed:{}
});
guideAndTips=new Vue({
    el:'#guide',
    data:{
        title:'',
        description:[],
        exerciseDescription:'',
        exerciseHint:'',
        img:'',
        positions:null
    },
    methods:{
        setData:function(data){
            this.img=data.img;
            this.title=data.title;
            if(data.positions!==undefined){
                this.positions=data.positions;
            }
        },getImgPath:function(){
            return "img/basics/"+this.img;
        }
    }
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
    currentMoves:[],
    init:function(chessBoard){
        this.currentMoves=[];
        let square=this.generatePawn(chessBoard.chess);
        this.generatePawnsToCapture(chessBoard.chess,square);
        this.currentMoves=chessBoard.chess.moves({verbose: true}).map(a => a.san);
        chessBoard.refresh();
    },
    update:function(chessBoard,move){
        this.currentMoves = this.currentMoves.filter(e => e !== move);
        if(this.currentMoves.length===0)
            this.init(chessBoard);
        else{
            chessBoard.chess.undo();
            chessBoard.refresh();
        }
    },generatePawn:function(chess){
        chess.clear();
        let factor=Math.floor(Math.random()*8);
        let line=Math.floor(Math.random()*5)+1;
        let nrSquare=8*factor+line;
        let square=PositionManipulator.nrToSquare(nrSquare);
        chess.put({type:'p',color:'w'},square);
        return square;
    },generatePawnsToCapture(chess,square) {
        let letter=square.charCodeAt(0);
        let number=parseInt(square.charAt(1))+1;
        let numberOfPawns = Math.floor(Math.random() * 3);
        let piece1=PositionManipulator.nrToPiece(Math.floor(Math.random()*5));
        if(numberOfPawns===1){
            let isLeftSide=Math.floor(Math.random()*2)===0;
            letter=letter+(isLeftSide?-1:1);
            letter=String.fromCharCode(letter);
            PositionManipulator.setPieces(chess,piece1,'b',[letter+number.toString()]);
        }else if(numberOfPawns===2){
            let l1=letter-1;
            let l2=letter+1;
            l1=String.fromCharCode(l1);
            l2=String.fromCharCode(l2);
            let s1=l1.toString()+number.toString();
            let s2=l2.toString()+number.toString();
            let piece2=PositionManipulator.nrToPiece(Math.floor(Math.random()*5));
            PositionManipulator.setPieces(chess,piece1,'b',[s1]);
            PositionManipulator.setPieces(chess,piece2,'b',[s2]);
        }
    }
};

let enPassantHandler={
    init:function(chessBoard){

        this.generatePawns(chessBoard.chess);
        chessBoard.refresh();
        let handler=this;
        setTimeout(function(){
            handler.makeFirstMove(chessBoard.chess);
            chessBoard.refresh();
        },500);
    },
    update:function(chessBoard){
        this.init(chessBoard);
    },
    generatePawns:function(chess){
        chess.clear();
        for(let i=97;i<105;i++){
           chess.put({type:'p',color:'b'},String.fromCharCode(i)+'7');
        }
        for(let i=0;i<4;i++){
            let letter=String.fromCharCode(Math.floor(Math.random()*8)+97);
            chess.put({type:'p',color:'w'},letter+'5');
        }
        let letter;
        letter=String.fromCharCode(Math.floor(Math.random()*8)+97);
        chess.put({type:'p',color:'w'},letter+'4');
        letter=String.fromCharCode(Math.floor(Math.random()*8)+97);
        chess.put({type:'p',color:'w'},letter+'6');
    },
    makeFirstMove:function(chess) {
        PositionManipulator.changeSideOnMove(chess);
        let whiteResponses=[];
        let longPawnsMoves=chess.moves({verbose:true}).filter(move=> move.flags === 'b');
        console.log(longPawnsMoves);
        let move;
        do{
            move=longPawnsMoves[Math.floor(Math.random()*longPawnsMoves.length)];
            chess.move(move);

            whiteResponses=chess.moves({verbose:true}).filter(move=> move.flags === 'e');

            chess.undo();
        }while(whiteResponses.length === 0 );
        chess.move(move);
    }
};

let positionHandler={
    positions:[],
    init:function (chessBoard) {
        chessBoard.load(this.positions[Math.floor(Math.random()*this.positions.length)]);
        chessBoard.refresh();
    },
    update:function(chessBoard,move){
        this.init();
    },
    setPositions(positions){
        this.positions=positions;
    },validator:null
};