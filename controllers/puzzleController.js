let puzzlesModel=require('../models/puzzlesModel');
let pgnParser=require('../models/pgnParser');
let userModel=require('../models/userModel');
let admin=require('../models/firebase/adminFirebase');
exports.savePuzzle=function(req,res){
    puzzlesModel.savePuzzle(req.body,function(isSavedOk){
           res.send(isSavedOk);
    });
};

let getRandomPuzzle=function(req,res){
    puzzlesModel.getRandomPuzzle(function(puzzle){

        pgnParser.pgnParse(puzzle.solution+' *',function(pgn){
            puzzle.solution=pgn[0].moves;
            res.send(puzzle);
        });

    });
};
exports.getRandomPuzzle=getRandomPuzzle;
exports.getPuzzleForUser=function(req,res){
    let data=req.body;
    admin.getUserIdFromToken(data.token,function(userId){
        userModel.getUserRatingAndLastPuzzles(userId,function(userRating,solvePuzzles){
           puzzlesModel.getPuzzleForPlayer(userRating,solvePuzzles,function(puzzle){
                if(puzzle===null)
                    getRandomPuzzle(req,res);
                else{
                    pgnParser.pgnParse(puzzle.solution+' *',function(pgn){
                        puzzle.solution=pgn[0].moves;
                        res.send(puzzle);
                    });
                }
           });
        });
    });
};
