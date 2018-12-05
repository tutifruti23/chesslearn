let chessGame=ChessGame('board');
let guideAndTips,counters;
let timeout;
let chapterRewinder=new Vue({
    el:'#left-menu',
    data:{
        chapters:chapters,
        selectedItem:-1
    },
    methods: {
        setMode: function (name) {
        },setData:function(index){
            guideAndTips.setData(data[index]);
        },changeChapter:function(index){
            clearTimeout(timeout);
            this.selectedItem=index;
            this.setData(index);
            this.chapters[index].method();
            console.log(index);
            chessGame.handlerInit();
            chessGame.refresh();
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
            this.exerciseDescription=data.exerciseDescription;
            if(data.positions!==undefined){
                this.positions=data.positions;
            }
        },getImgPath:function(){
            return "img/basics/"+this.img;
        }
    }
});
counters=new Vue({
    el:'#counters',
    data:{
        goodCount:0,
        badCount:0,
        lastResult:''
    },methods:{
        increaseCounter:function(isGood){
            this.lastResult=isGood?'good':'bad';
            if(isGood)
                this.goodCount++;
            else
                this.badCount++;
        }
    }
});
chapterRewinder.changeChapter(0);
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
                counters.increaseCounter(true);
                PositionManipulator.randomMoveWithCheck(chessBoard.chess);
            }else{
                counters.increaseCounter(chessBoard.chess.in_check());
                PositionManipulator.randomMove(chessBoard.chess);
            }
            if(chessBoard.chess.turn()==='b' || this.numberOfMoves===5 || chessBoard.chess.moves().length<2){
                    this.init(chessBoard);
            }
            timeout=setTimeout(function () {
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
        this.currentMoves = this.currentMoves.filter(e => e !== move.san);
        if(this.currentMoves.length===0){
            counters.increaseCounter(true);
            this.init(chessBoard);
        }
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
        timeout=setTimeout(function(){
            handler.makeFirstMove(chessBoard.chess);
            chessBoard.refresh();
        },500);
    },
    update:function(chessBoard,move){
        counters.increaseCounter(move.flags==='e');
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
let pawnPromotionHandler={
    init:function(chessBoard){

        this.generatePawns(chessBoard.chess);
        chessBoard.refresh();


    },
    update:function(chessBoard,move){
        counters.increaseCounter(move.flags.includes('p'));
        this.init(chessBoard);
    },
    generatePawns:function(chess){
        chess.clear();

        for(let i=0;i<4;i++){
            let letter=String.fromCharCode(Math.floor(Math.random()*8)+97);
            chess.put({type:'p',color:'w'},letter+'7');
        }
        let letter;
        letter=String.fromCharCode(Math.floor(Math.random()*8)+97);
        chess.put({type:'p',color:'w'},letter+'4');
        letter=String.fromCharCode(Math.floor(Math.random()*8)+97);
        chess.put({type:'p',color:'w'},letter+'6');
    },
};
let positionHandler={
    init:function (chessBoard) {
        let pos=guideAndTips.positions[Math.floor(Math.random()*guideAndTips.positions.length)];
        chessBoard.chess.load(pos);
        chessBoard.refresh();
    },
    update:function(chessBoard,move){
        this.validate(chessBoard.chess,move);
        let handler=this;
        timeout=setTimeout(
            function(){handler.init(chessBoard)},500
        );
    },
    validator:null,
    validate:function(chess,move){
        if(this.validator!==null)
            counters.increaseCounter(this.validator(chess,move));
    }
};
function pawnsCapturingEventHandler(piece){
    let eventHandler={
        level:1,
        pawnsLeft:0,
        levelAccepted:true,
        update:function(chessBoard,move){
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
                counters.increaseCounter(this.levelAccepted);
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