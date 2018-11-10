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
    let info=$('#info');
    info.removeClass('errorInfo');
    info.addClass('successInfo');
    showAndclearInfo(text)
}
function addErrorInfo(text){
    let info=$('#info');
    info.removeClass('successInfo');
    info.addClass('errorInfo');
    showAndclearInfo(text)
}
function showAndclearInfo(text){
    $('#info').text(text);
    setTimeout(function(){ $('#info').text(''); }, 3000);
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
        chessGame.chess.load(PositionManipulator.chessboardFenToFen(chessboardFen,settings.getColor(),settings.castling(),settings.getEnpassant()));
    }
};
let settings=new Vue({
    el:"#app",
    data:{
        color:'w',
        wkCastle:false,
        wqCastle:false,
        bkCastle:false,
        bqCastle:false,
        spareMode:true,
        engineDepth:15,
        enginePosition:'',
        numberEngineLines:2,
        firstEngineLine:'',
        secondEngineLine:'',
        thirdEngineLine:'',
        level:3,
        result:'win',
        enpassant:''
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
                    result:this.result,
                    level:this.level
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
                 case 'start':chessGame.setPosition(PositionManipulator.getStartFen());this.setCastles(true);break;
                 case 'empty':chessGame.setPosition(PositionManipulator.getEmptyBoardFen());this.setCastles(false);break;
             }
        },updateFen:function(){
            let chessboardFen=chessGame.board.position();
            chessGame.chess.load(PositionManipulator.chessboardFenToFen(chessboardFen,this.getColor(),this.castling(),'-'));
        },setCastles:function(isAllow){
             this.wkCastle=isAllow;
             this.wqCastle=isAllow;
             this.bkCastle=isAllow;
             this.bqCastle=isAllow;
        },getEnpassant:function () {
            let res='-';
            let enp=this.enpassant;
            if(this.enpassant.length===2
                && enp.charCodeAt(0)>=97
                && enp.charCodeAt(0)<105
                && (settings.color==='w'&&enp.charAt(1)==='6'|| settings.color==='b'&&enp.charAt(1)==='3'))
                res=enp;
            return  res;
        }
    },computed:{

    }
});
chessGame.setHandler(puzzleSpareHandler);
chessGame.setMode(spareMode);
chessGame.handlerInit();
chessGame.setPosition(PositionManipulator.getEmptyBoardFen());



