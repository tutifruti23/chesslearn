
board = ChessBoard('board', cfg);
var chessBoard=new Vue({
    el:".app",
    data:{
        boardId:'',
        board:null,
        cfg:null,
        chess:new Chess(),
        onSnapEnd:function() {
            this.board.position(this.chess.fen());
        },
        onDragStartLegalMoves:function(source, piece, position, orientation) {
            if (this.chess.game_over() === true ||
                (this.chess.turn() === 'w' && piece.search(/^b/) !== -1) ||
                (this.chess.turn() === 'b' && piece.search(/^w/) !== -1)) {
                return false;
            }
        },
        onDropLegalMoves:function(source, target) {
            // see if the move is legal
            var move = this.chess.move({
                from: source,
                to: target,
                promotion: 'q' // NOTE: always promote to a queen for example simplicity
            });

            // illegal move
            if (move === null) return 'snapback';
        }
    },
    methods:{
        initBoard:function(){
            this.board=ChessBoard(this.boardId,this.cfg);
        },
        freeMode:function(){
            this.cfg={
            }

        },legalMovesMode:function(){
            this.cfg={
                draggable: true,
                position: 'start',
                onDragStart: this.onDragStartLegalMoves,
                onDrop: this.onDropLegalMoves,
                onSnapEnd: this.onSnapEnd,
                showNotation: false
            };
        },gameMode:function(){

        }
    }
});


