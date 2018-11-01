let PositionManipulator={
    changeSideOnMove:function (chess){
        let tempFen=chess.fen().split(" ");
        tempFen[1]=tempFen[1]==='w'?'b':'w';
        tempFen[tempFen.length-3]="-";
        let newFen="";
        for(let j=0;j<tempFen.length;j++){
            if(j>0)
                newFen+=" ";
            newFen+=tempFen[j];
        }
        chess.load(newFen);
    },
    nrToSquare:function (nr){
        let number=nr%8+1;
        let letter=String.fromCharCode((nr-number+1)/8+97);
        return letter+number.toString();
    },
    setPieces:function (chess,piece,color,squares){
        for(let i=0;i<squares.length;i++){
            chess.put({color:color,type:piece},squares[i]);
        }
    },chessboardFenToFen:function(chessboardFen,color,castlingString,enPassant){

        return chessboardFen+' '+color+' '+ (castlingString===undefined?'':castlingString+' ')+(enPassant===undefined?'':enPassant+' ')+'0 1';
    },getStartFen:function(){
        return 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    }, getEmptyBoardFen:function(){
        return '8/8/8/8/8/8/8/8 w - - 0 1';
    },getRandomSquare:function(){
        return this.nrToSquare(Math.floor(Math.random()*64));
    },randomMove:function(chess){
        let possibleMoves = chess.moves();
        // game over
        if (possibleMoves.length === 0) return;
        let randomIndex = Math.floor(Math.random() * possibleMoves.length);
        chess.move(possibleMoves[randomIndex]);
    },randomMoveWithCheck:function(chess){
        let moves=chess.moves();
        let checkMoves=[];
        for(let i=0;i<moves.length;i++) {
            chess.move(moves[i]);
            if(chess.in_check()){
                checkMoves.push(moves[i]);
            }
            chess.undo();
        }
        if(checkMoves.length>0){
            let randomIndex = Math.floor(Math.random() * checkMoves.length);
            chess.move(checkMoves[randomIndex]);
        }
    },nrToPiece:function(num){
        let piece;
        switch (num){
            case 0:piece='p';break;
            case 1:piece='n';break;
            case 2:piece='b';break;
            case 3:piece='r';break;
            case 4:piece='q';break;
            case 5:piece='k';break;
        }
        return piece;
    }
};