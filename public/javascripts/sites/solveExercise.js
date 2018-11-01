let engine=new Engine();
engine.init(function(event){
    let match = event.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbk])?/);
    if(match){
        chessGame.chess.move({from: match[1], to: match[2], promotion: match[3]});
        chessGame.board.position( chessGame.chess.fen());
        isGameOver(false);
    }
});
let isGameOver=function(lastPlayerMove){
    if(chessGame.chess.game_over() && !settings.reviewMode){
        console.log(chessGame.chess.in_draw());
        console.log(chessGame.chess.in_checkmate());
        console.log('koniec');
        return true;
    }else{
        return false;
    }
};
function puzzleCompleted(result){
    let exerciseComplete;
    switch (result){
        case 1:exerciseComplete=true;break;
        case 0:exerciseComplete=settings.currentPuzzle['expectedScore']>=0;break;
        case -1:exerciseComplete=false;break;
    }
    $.post(
        '/solveExercise/exerciseComplete',{
            isCompleted:exerciseComplete,
        }
    )
}
let loadRandomExercise=function(){
    $.get(
        '/solveExercise/newRandomExercise',
        function(result){
            settings.currentPuzzle=result;
            chessGame.setPosition(result.fen);
            NotationMethods.newPosition(settings.listMoves,result.fen);
            changeToExerciseMode();
        }
    );
};
let exerciseHandler={
    init:function(){},
    update:function(chessBoard,move){
        settings.listMoves.newMove(move,chessBoard.chess.fen());
        if(!isGameOver(true)){
            setTimeout(function() {engine.goDepth(chessBoard.chess.fen(),15)},50);
        }
    }
};
function changeToReview(){
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
        settings.listMoves.newMove(move,chessBoard.chess.fen());
    }
};
let chessGame=ChessGame('board');
chessGame.setMode(gameMode);
chessGame.setHandler(reviewHandler);
let settings=new Vue({
    el:"#settings",
    data:{
        listMoves:NotationMethods.newListMoves(PositionManipulator.getStartFen()),
        userLogged:'',
        reviewMode:true,
        currentPuzzle:{}
    },
    methods:{
        nextPuzzle:function(){
            loadRandomExercise();
        },
        getListMoves:function(){
            return this.reviewMode?this.listMoves.getNotation():this.listMoves.getRawNotation();
        },giveUp:function(){
            changeToReview(false);
        }
    }
});