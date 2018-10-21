const pgnParser=require('pgn-parser');


exports.pgnParse=function(){
    pgnParser(function(err,parser){
        const [result] = parser.parse('[White "me"]\n[Black "you"]\n1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5 (3. ...Nf6 {is the two knights}) 4. b4 Bxb4 5. c3 Ba5 6. d4 exd4 7. O-O Nge7 $1 *');
        parsedPgnToListMoves(result);
    });
};
exports.testFunc=function(){
    console.log('dzilam');

};





function parsedPgnToListMoves(parsedPgn){
    for(let i=0;i<parsedPgn.moves.length;i++){
        console.log(parsedPgn.moves[i]);
        if(parsedPgn.moves[i]['ravs']!== undefined){
            console.log(parsedPgn.moves[i]['ravs'][0]);
        }
    }
}

