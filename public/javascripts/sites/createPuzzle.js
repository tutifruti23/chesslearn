let chessGame=ChessGame('board');
chessGame.setMode(spareMode);

let createPuzzleController=new Vue({
    data:{
        spareMode:true,


    },
    methods:{

    },
    computed:{

    }
});
let engine=new Engine();
let callback=function(event){
    if(event.includes('pv')){

        let info=engine.parseAnaliseLine(event);
        console.log(info['pv']);
        settings.setEngineLine(parseInt(info['multipv']),info['pv']);
    }
};
engine.init(callback);
let puzzleSpareHandler={

    init:function(chessBoard){},
    update:async function(chessGame,chessboardFen){

        //engine.goAnaliseDepth(PositionManipulator.chessboardFenToFen(chessboardFen,'w'),15,3);
    }
};
let variantCreatingHandler={
    init:function(chessBoard){
        settings.listMoves=ListMoves(new Move('',PositionManipulator.chessboardFenToFen(chessBoard.board.fen(),settings.color),null));

    },
    update:function(chessBoard,move){
        //moves.newMove(move.san,chessBoard.board.fen());
        //engine.goAnaliseDepth(chessBoard.chess.fen(),settings.engineDepth,settings.engineLines);
        settings.listMoves.newMove(move,chessBoard.chess.fen());
    }
};
chessGame.setHandler(puzzleSpareHandler);
let settings=new Vue({
    el:"#settings",
    data:{
        color:'w',
        wkCastle:true,
        wqCastle:true,
        bkCastle:true,
        bqCastle:true,
        spareMode:true,
        engineDepth:15,
        numberEngineLines:3,
        listMoves:null,
        firstEngineLine:'',
        secondEngineLine:'',
        thirdEngineLine:''
    },
    methods: {
        changeToSetMode: function () {
            let pos = PositionManipulator.chessboardFenToFen(chessGame.board.fen(),settings.color);
            chessGame.setMode(gameMode);
            chessGame.setPosition(pos);
            chessGame.setHandler(variantCreatingHandler);
            chessGame.handlerInit();
        },
        backToSpareMode: function () {
            let pos = chessGame.chess.fen();
            chessGame.setMode(spareMode);
            chessGame.setPosition(pos);
            chessGame.setHandler(puzzleSpareHandler);
            chessGame.handlerInit();
        }, castling: function () {
            let res = "";
            if (this.wkCastle === true)
                res+='K';
            if (this.wqCastle === true)
                res+='Q';
            if (this.bkCastle === true)
                res+='k';
            if (this.bqCastle === true)
                res+='q';
            return res;
        },engineAnalise:function(){
            engine.goAnaliseDepth(chessGame.chess.fen(),this.engineDepth,this.numberEngineLines);
        },setEngineLine(num,line){
            switch (num){
                case 1:this.firstEngineLine=line;break;
                case 2:this.secondEngineLine=line;break;
                case 3:this.thirdEngineLine=line;break;
            }
        }


    },computed:{

    }
});





