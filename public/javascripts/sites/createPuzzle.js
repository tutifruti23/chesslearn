userController={
    initInfo:function(user){

        setDataWithToken(function(token) {
            $.post('/createPuzzle/checkUserIsCreator',{token:token}, function (isCreator) {
                if(isCreator){
                    $('#app').css('opacity','1');
                }else{
                    window.location.href='/';
                }

            }); 
        });
    },
    logout:function(){
        window.location.href='/';
    }
};
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
        settings.listMoves=NotationMethods.newListMoves(chessBoard.chess.fen());
    },
    update:function(chessGame,chessboardFen){
        chessGame.chess.load(PositionManipulator.chessboardFenToFen(chessboardFen,settings.getColor(),settings.castling(),settings.getEnpassant()));
    }
};
let variantCreatingHandler={
    init:function(chessBoard){
        settings.listMoves=NotationMethods.newListMoves(chessBoard.chess.fen());
    },
    update:function(chessBoard,move){
        settings.listMoves.newMove(move.san,chessBoard.chess.fen());
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
        enpassant:'',
        engineDepth:15,
        enginePosition:'',
        listMoves:NotationMethods.newListMoves(PositionManipulator.getStartFen()),
        numberEngineLines:2,
        firstEngineLine:'',
        secondEngineLine:'',
        thirdEngineLine:''
    },
    methods: {
        changeToSetMode: function () {
            chessGame.chess.load(PositionManipulator.chessboardFenToFen(ChessBoard.objToFen(chessGame.board.position()),settings.getColor(),settings.castling(),settings.getEnpassant()));
            this.spareMode=false;
            chessGame.setHandler(variantCreatingHandler);
            chessGame.setMode(gameMode);
            chessGame.handlerInit();
            settings.listMoves.setListener(function(move){
                chessGame.setPosition(move.position);
            });

        },
        backToSpareMode: function () {
            this.spareMode=true;
            chessGame.setHandler(puzzleSpareHandler);
            chessGame.setMode(spareMode);
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
            return res===''?'-':res;
        },getEnpassant:function () {
            let res='-';
            let enp=this.enpassant;
            if(this.enpassant.length===2
                && enp.charCodeAt(0)>=97
                && enp.charCodeAt(0)<105
                && (settings.color==='w'&&enp.charAt(1)==='6'|| settings.color==='b'&&enp.charAt(1)==='3'))
                    res=enp;
             return  res;
        },
        engineAnalise:async function(){
            this.enginePosition=chessGame.chess.fen();
            engine.goAnaliseDepth(this.enginePosition,this.engineDepth,this.numberEngineLines);
        },setEngineLine:function(num,line,cp,mate){
            let notation=engine.variantEngineLineToNotation(line,this.enginePosition,1,cp,mate);
            switch (num){
                case 1:this.firstEngineLine=notation;break;
                case 2:this.secondEngineLine=notation;break;
                case 3:this.thirdEngineLine=notation;break;
            }
        },getListMoves:function(){
            return this.listMoves.getNotation();
        }, getColor:function(){
            return this.color;
        },downloadPgn:function(){
            let filename='puzzle.pgn';
            let file = new Blob([NotationMethods.listMovesToPgn(this.listMoves)], {type:'text/plain'});
            let a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 5);

        },savePgn:function(){
            let notation=this.listMoves.getRawNotation().trim();
            if(notation===""){
                addErrorInfo('Solution can not be empty');
            }else{
                $.post(
                    '/createPuzzle/savePuzzle',
                    {
                        fen:this.listMoves.firstMove.position,
                        solution:this.listMoves.getRawNotation()
                    },
                    function(isSaved) {
                        if(isSaved)
                            addSuccessInfo('Saved!');
                        else
                            addErrorInfo('Error');
                    }
                );
            }
        },setPosition(pos){
            switch (pos){
                case 'start':chessGame.setPosition(PositionManipulator.getStartFen());this.setCastles(true);break;
                case 'empty':chessGame.setPosition(PositionManipulator.getEmptyBoardFen());this.setCastles(false);break;
            }
        },setCastles:function(isAllow){
            this.wkCastle=isAllow;
            this.wqCastle=isAllow;
            this.bkCastle=isAllow;
            this.bqCastle=isAllow;
        }
    },computed:{

    }
});
chessGame.setHandler(puzzleSpareHandler);
chessGame.setMode(spareMode);
chessGame.handlerInit();



