let ChessGame=function(boardId){
    let chessboard={
        boardId:boardId,
        board:this.board=ChessBoard(boardId),
        cfg:null,
        chess:new Chess(),
        eventHandler:null,
        initBoard:function(){
            this.board=ChessBoard(this.boardId,this.cfg);
        },
        setMode:function(mode){
            this.cfg=mode(this);
            this.initBoard();


        },refresh:function(){
            this.board.position(this.chess.fen());1
        },
        setPosition:function(fen) {
            this.board.position(fen);
            this.chess.load(fen);
        },setHandler:function(handler) {
            this.eventHandler=handler;
        },handlerUpdate:function(move){
            if(this.eventHandler!==null)
                this.eventHandler.update(this,move);
        },handlerInit:function(){
            if(this.eventHandler!==null)
                this.eventHandler.init(this);
        }
    };
    return chessboard;
};














