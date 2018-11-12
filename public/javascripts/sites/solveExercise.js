let engine=new Engine();
userController={
    initInfo:function(){
        settings.readyForNextPuzzles=true;
        settings.nextPuzzle();

    },
    logout:function(){
        settings.readyForNextPuzzles=true;
        settings.nextPuzzle();
    }
};

engine.init(function(event){
    let match = event.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
    if(match){
        let move=chessGame.chess.move({from: match[1], to: match[2], promotion: match[3]});
        chessGame.board.position( chessGame.chess.fen());
        settings.listMoves.newMove(move.san,chessGame.chess.fen());
        isGameOver(false);
    }
});
let isGameOver=function(lastPlayerMove){
    if(chessGame.chess.game_over() && !settings.reviewMode){
        let score;
        if(chessGame.chess.in_draw())
            score=0;
        else{
            score=lastPlayerMove?1:-1;
        }
        exerciseCompleted(score,function(completed){
            changeToReview(completed);
        });
        return true;
    }else{
        return false;
    }
};
function exerciseCompleted(result,callback){
    settings.loading=true;
    let exerciseComplete;
    switch (result){
        case 1:exerciseComplete=true;break;
        case 0:exerciseComplete=userAndPuzzleData.exerciseData.result==='draw';break;
        case -1:exerciseComplete=false;break;
    }
    setDataWithToken(function(token){
        if(token!==null){
            $.post(
                '/solveExercise/exerciseComplete',{
                    isGood:exerciseComplete,
                    token:token,
                    docId:userAndPuzzleData.exerciseData.docId
                },function(isOk){
                    callback(exerciseComplete);
                    settings.loading=false;
                }
            );
        }else{
            settings.loading=false;
            callback(exerciseComplete);
        }
    });
    return exerciseComplete;
}
let loadExercise=function(){
    setDataWithToken(function(token){
        let path=token===null?'/solveExercise/newRandomExercise':'/solveExercise/newExerciseUser';
        if(userAndPuzzleData)
            $.post(
                path
                ,{
                    token:token
                },
                function(result){
                    settings.loading=false;
                    settings.readyForNextPuzzles=true;
                    if(result){

                        userAndPuzzleData.exerciseData=result;
                        chessGame.setPosition(result.fen);
                        settings.playerColor=chessGame.chess.turn();
                        NotationMethods.newPosition(settings.listMoves,result.fen);

                        changeToExerciseMode();
                    }else{

                    }
                }
            );
    });


};
let exerciseHandler={
    init:function(){},
    update:function(chessBoard,move){
        settings.listMoves.newMove(move.san,chessBoard.chess.fen());
        if(!isGameOver(true)){
            setTimeout(function() {engine.goDepth(chessBoard.chess.fen(),15)},50);
        }
    }
};
function changeToReview(isOk){
    settings.lastScore=isOk;
    settings.reviewMode=true;
    chessGame.setHandler(reviewHandler);
    chessGame.setMode(gameMode);
    settings.listMoves.setListener(function(move){
        chessGame.setPosition(move.position);
    });
}
function changeToExerciseMode(){
    settings.reviewMode=false;
    chessGame.setHandler(exerciseHandler);
    chessGame.setMode(allowOnlyOneSideMode);
    settings.listMoves.setListener(null);
}
let reviewHandler={
    init:function(){},
    update:function(chessBoard,move){
        settings.listMoves.newMove(move.san,chessBoard.chess.fen());
    }
};
let chessGame=ChessGame('board');
chessGame.setPosition(PositionManipulator.getEmptyBoardFen());
chessGame.setMode(gameMode);
chessGame.setHandler(reviewHandler);
let settings=new Vue({
    el:"#settings",
    data:{
        listMoves:NotationMethods.newListMoves(PositionManipulator.getStartFen()),
        readyForNextPuzzles:false,
        reviewMode:true,
        playerColor:'',
        lastScore:true,
        loading:true,
    },
    methods:{
        nextPuzzle:function(){

            if(this.readyForNextPuzzles){
                this.readyForNextPuzzles=false;
                loadExercise();
            }
        },
        getListMoves:function(){
            return this.reviewMode?this.listMoves.getNotation():this.listMoves.getRawNotation();
        },giveUp:function(){
            exerciseCompleted(-1,function(){
                changeToReview(false);
            });
        },getInfoText:function(){
            if(this.reviewMode){
                return this.lastScore?'Correct!':'Exercise failed';
            }else{
                return  userAndPuzzleData.exerciseData.result +' with '+(this.playerColor==='w'?'white':'black');
            }

        },getInfoImagePath(){
            if(this.reviewMode){
                return "img/basics/"+(this.lastScore?'good':'bad')+".png";
            }else{
                return "img/chesspieces/wikipedia/"+(this.playerColor==='b'?'b':'w')+"R.png";
            }
        },
    }
});
let userAndPuzzleData=new Vue({
    el:"#userAndPuzzleData",
    data:{
        userLogin:false,
        exerciseData:undefined,

    },methods:{
        getExerciseId:function(){
            return this.exerciseData===undefined?'?':'#'+this. exerciseData.id;

        },getExerciseLevel:function(){
            return this.exerciseData===undefined?'?':this. exerciseData.level;
        },getUserLastAttemptDate:function () {
            return this.exerciseData===undefined||this. exerciseData.lastTimeSolved===undefined?'?':this. exerciseData.lastTimeSolved.slice(0,10);
        },getUserAttempts:function(){
            return this.exerciseData===undefined||this. exerciseData.attempts===undefined?'?':this. exerciseData.attempts;
        }
    }
});
