let loadRandomPuzzle=function(){
    $.get(
        '/solvePuzzle/newRandomPuzzle',
        function(result){
           chessGame.setPosition(result.fen);
           NotationMethods.arrayMovesToListMoves(result.fen,settings.listMoves,result.solution);
        }
    );
};
let puzzleHandler={
    init:function(){},
    update:function(chessboard,move){
        settings.listMoves.next();
        if(move.san === settings.listMoves.current.move){
            if(settings.listMoves.hasNextMoves()){
                setTimeout(function(){
                    settings.listMoves.next();
                    chessboard.setPosition(settings.listMoves.current.position);
                    if(!settings.listMoves.hasNextMoves())
                        changeToReview(true);
                },200)
            }else{
                changeToReview(true);
            }
        }
        else
            changeToReview(false);
    },
};
function changeToReview(){
    settings.reviewMode=true;
    chessGame.setHandler(reviewHandler);
    chessGame.setMode(gameMode);
    settings.listMoves.setListener(function(move){
        chessGame.setPosition(move.position);
    });
}
function changeToPuzzleMode(){
    settings.reviewMode=false;
    chessGame.setHandler(puzzleHandler);
    settings.listMoves.setListener(null);
}
let reviewHandler={
    init:function(){
        settings.reviewMode=true;
    },
    update:function(chessBoard,move){
        settings.listMoves.newMove(move.san,chessBoard.chess.fen());
    }
};
let chessGame=ChessGame('board');
chessGame.setMode(gameMode);
chessGame.setHandler(puzzleHandler);
let settings=new Vue({
    el:"#settings",
    data:{
        listMoves:NotationMethods.newListMoves(PositionManipulator.getStartFen()),
        userLogged:'',
        reviewMode:false
    },
    methods:{
        nextPuzzle:function(){
            changeToPuzzleMode();
            loadRandomPuzzle()
        },
        getListMoves:function(){
            return this.listMoves.getNotation();
        },giveUp:function(){
            changeToReview(false);
        }
    }
});


