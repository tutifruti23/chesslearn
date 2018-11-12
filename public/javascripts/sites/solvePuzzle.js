let loadPuzzle=function(){

    setDataWithToken(function(token){

        let path=token===null?'/solvePuzzle/newRandomPuzzle':'/solvePuzzle/newPuzzleUser';
        $.post(
            path,{
                token:token
            },
            function(result){
                userAndPuzzleData.puzzleData=result;
                changeToPuzzleMode();
                chessGame.setPosition(result.fen);
                NotationMethods.arrayMovesToListMoves(result.fen,settings.listMoves,result.solution);
                settings.playerColor=chessGame.chess.turn();
            }
        );

    });

};
let setScore=function(score){
    setDataWithToken(function(token){
        $.post(
            'solvePuzzle/solvePuzzle',{
                score:score,
                token:token,
                puzzleId:userAndPuzzleData.puzzleData.id,
                docId:userAndPuzzleData.puzzleData.docId
            },
            function(data){
                userAndPuzzleData.rating=data.rating;
            }
        )
    });
};
function getUserRating(token){
    $.post(
        'solvePuzzle/getRating'
       ,{
            token:token
        },
            function (data) {

            userAndPuzzleData.rating=data.rating;
        }
    );
}

let userAndPuzzleData=new Vue({
    el:"#userAndPuzzleData",
    data:{
        rating:'?',
        solved:0,
        unsolved:0,
        puzzleData:undefined
    },methods:{
        increaseCounter:function(isGood){
            if(isGood)
                this.solved++;
            else
                this.unsolved++;
        },getPuzzleId:function(){
            return this.puzzleData===undefined?'?':'#'+this.puzzleData.id;

        },getPuzzleRating:function(){
            return this.puzzleData===undefined?'?':this.puzzleData.rating;
        },
        getPuzzleAttempts:function(){
            return this.puzzleData===undefined?'?':this.puzzleData.attempts;
        }
    }
});

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
function changeToReview(isOk){
    userAndPuzzleData.increaseCounter(isOk);
    settings.lastScore=isOk;
    settings.reviewMode=true;
    chessGame.setHandler(reviewHandler);
    chessGame.setMode(gameMode);
    settings.listMoves.setListener(function(move){
        chessGame.setPosition(move.position);
    });
    setScore(isOk?1:-1);
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
        reviewMode:true,
        lastScore:true,
        playerColor:''
    },
    methods:{
        nextPuzzle:function(){
            loadPuzzle()
        },
        getListMoves:function(){
            return this.listMoves.getNotation();
        },giveUp:function(){
            changeToReview(false);
        },getInfoImagePath(){
            if(this.reviewMode){
                return "img/basics/"+(this.lastScore?'good':'bad')+".png";
            }else{

                return "img/chesspieces/wikipedia/"+(this.playerColor==='b'?'b':'w')+"R.png";
            }

        },getInfoText(){
            let res;
            if(this.reviewMode){
                res=this.lastScore?'Correct!':"Puzzle failed.";
            }else{
                res=(this.playerColor==='w'?'white':'black')+ ' to move';
            }
            return res;
        }
    }
});
let userController={
    initInfo:function(){
        setDataWithToken(function (token) {
            getUserRating(token);
        });
    },
    logout:function(){

        userAndPuzzleData.rating='?';
    }
};
