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
    }
};