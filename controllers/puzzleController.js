let puzzlesModel=require('../models/puzzlesModel');
let pgnParser=require('../models/pgnParser');
exports.savePuzzle=function(req,res){
    puzzlesModel.savePuzzle(req.body,function(isSavedOk){
           res.send(isSavedOk);
    });
};

exports.getRandomPuzzle=function(req,res){
    puzzlesModel.getRandomPuzzle(function(puzzle){

        pgnParser.pgnParse(puzzle.solution+' *',function(pgn){
            puzzle.solution=pgn[0].moves;
            res.send(puzzle);
        });

    });
};