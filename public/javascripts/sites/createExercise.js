let chessGame=ChessGame('board');
let engine=new Engine();
let num_threads = 2;
let MT = new Multithread(num_threads);

let getEvent=function(event){
    return event;
};

let writeLines=function(event){
    if(event.includes('pv')){
        let info=engine.parseAnaliseLine(event);
        settings.setEngineLine(parseInt(info['multipv']),info['pv'],info['cp'],info['mate']);
    }
};
function addSuccessInfo(text){
    $('#login-form-link').removeClass('errorInfo');
    $(this).addClass('successInfo');
    showAndclearInfo(text)
}
function addErrorInfo(text){
    $('#login-form-link').removeClass('successInfo');
    $(this).addClass('errorInfo');
    showAndclearInfo(text)
}
function showAndclearInfo(text){
    $('#info').text(text);
    setTimeout(function(){ $('#info').text(''); }, 7000);
}
let engineAnalise=MT.process(getEvent,writeLines);

let callback=async function(event){
    engineAnalise(event);
};
engine.init(callback);
let puzzleSpareHandler={
    init:function(chessBoard){
        chessBoard.board.position(chessBoard.chess.fen());
    },
    update:function(chessGame,chessboardFen){
        chessGame.chess.load(PositionManipulator.chessboardFenToFen(chessboardFen,settings.getColor(),settings.castling(),'-'));
    }
};
let settings=new Vue({
    el:"#app",
    data:{
        color:'w',
        wkCastle:true,
        wqCastle:true,
        bkCastle:true,
        bqCastle:true,
        spareMode:true,
        engineDepth:15,
        enginePosition:'',
        numberEngineLines:2,
        firstEngineLine:'',
        secondEngineLine:'',
        thirdEngineLine:''
    },
    methods: {
         castling: function () {
            let res = "";
            if (this.wkCastle === true)
                res+='K';
            if (this.wqCastle === true)
                res+='Q';
            if (this.bkCastle === true)
                res+='k';
            if (this.bqCastle === true)
                res+='q';
            return '-';
        },engineAnalise:async function(){
            this.enginePosition=chessGame.chess.fen();
            console.log(this.enginePosition);
            engine.goAnaliseDepth(this.enginePosition,this.engineDepth,this.numberEngineLines);
        },setEngineLine:function(num,line,cp,mate){
            let notation=engine.variantEngineLineToNotation(line,this.enginePosition,1,cp,mate);
            switch (num){
                case 1:this.firstEngineLine='1. '+ notation;break;
                case 2:this.secondEngineLine='2. '+notation;break;
                case 3:this.thirdEngineLine='3. '+ notation;break;
            }
        },setColor:function(color){
            this.color=color;
        }
        ,getColor:function(){
            return this.color;
        },saveExercise:function(){
             this.updateFen();
            $.post(
                '/createExercise/saveExercise',
                {
                    fen:chessGame.chess.fen(),
                },
                function(isSaved) {
                    if(isSaved)
                        addSuccessInfo('Saved!');
                    else
                        addErrorInfo('Error');
                }
            );
        },setPosition(pos){
             switch (pos){
                 case 'start':chessGame.setPosition(PositionManipulator.getStartFen());break;
                 case 'empty':chessGame.setPosition(PositionManipulator.getEmptyBoardFen());break;
             }
        },updateFen:function(){
            let chessboardFen=chessGame.board.position();
            chessGame.chess.load(PositionManipulator.chessboardFenToFen(chessboardFen,this.getColor(),this.castling(),'-'));
        }
    },computed:{

    }
});
chessGame.setHandler(puzzleSpareHandler);
chessGame.setMode(spareMode);
chessGame.handlerInit();
chessGame.setPosition(PositionManipulator.getEmptyBoardFen());



