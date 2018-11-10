let data=[{
    title:"Rook",
    exerciseDescription:"Capture black pieces",
    exerciseHint:"",
    img:"rook.png",
  },
  {
    title:"Bishop",
    exerciseDescription:"Capture black pieces",
    exerciseHint:"",
    description:[
    ],
    img:"bishop.png",

  },
  {
    title:"Queen",
    exerciseDescription:"Capture black pieces",
    exerciseHint:"",
    description:[],
    img:"queen.png",

  },{
      title:"Knight",
      exerciseDescription:"Capture black pieces",
      exerciseHint:"",
      description:[],
      img:"knight.png",
  },{
      title:"King",
      exerciseDescription:"Capture black pieces",
      exerciseHint:"",
      description:[],
      img:"king.png",

  },{
      title:"Pawn",
      exerciseDescription:"Capture black pieces",
      exerciseHint:"",
      description:[],
      img:"pawn.png",

  },{
      title:"Pawn promotion",
      exerciseDescription:"",
      description:[],
      img:"",

  },{
      title:"Check",
      exerciseDescription:"",
      description:[],
      img:"check.png",

  },{
      title:"Check - defend",
      exerciseDescription:"",
      description:[],
      img:"checkdefend.png",

  },{
      title:"Checkmate",
      exerciseDescription:"",
      description:[],
      img:"checkmate.png",
      positions:[
          '6k1/3Q4/6K1/8/8/8/8/8 w - - 0 1',
          '6k1/8/6K1/8/8/8/4R3/8 w - - 0 1',
          '2k5/2B5/2K5/8/2N5/8/8/8 w - - 0 1'
      ]
  },{
      title:"Stalemate",
      exerciseDescription:"",
      description:[],
      img:"stalemate.png",
        positions:[
            '7k/8/6KP/8/8/8/8/8 w - - 0 1',
            '2k5/2B5/2K5/8/2N5/8/8/8 w - - 0 1'
        ]
  },{
      title:"Castle",
      exerciseDescription:"",
      description:[],
      img:"castle.png",
        positions:[
            '1r2kr2/8/8/8/8/8/8/R3K2R w KQkq - 0 1',
            '8/8/8/8/8/8/2k5/R3K2R w KQkq - 0 1',
            '1k6/8/8/8/3b4/8/8/R3K2R w KQkq - 0 1'
        ]
  },{
      title:"En-passant",
      exerciseDescription:"",
      description:[],
      img:"enpassant.png",
  }
];
let chapters=[
    {
        name:"Rook",
            method:function(){
            console.log('dzia;am');
            chessGame.setHandler(pawnsCapturingEventHandler('r'));
            chessGame.setMode(oneColorMovesModeWithoutKingControl);
        }
    },
    {
        name:"Bishop",
            method:function(){
            chessGame.setHandler(pawnsCapturingEventHandler('b'));
            chessGame.setMode(oneColorMovesModeWithoutKingControl);
        }
    },
    {
        name:"Queen",
            method:function(){
            chessGame.setHandler(pawnsCapturingEventHandler('q'));
            chessGame.setMode(oneColorMovesModeWithoutKingControl);
        }
    },
    {
        name:"Knight",
            method:function(){
            chessGame.setHandler(pawnsCapturingEventHandler('n'));
            chessGame.setMode(oneColorMovesModeWithoutKingControl);
        }
    },
    {
        name:"King",
            method:function(){
            chessGame.setHandler(pawnsCapturingEventHandler('k'));
            chessGame.setMode(oneColorMovesModeWithoutKingControl);
        }
    },
    {
        name:"Pawn",
            method:function(){
            chessGame.setHandler(pawnHandler);
            chessGame.setMode(noOverMode);
        }
    },
    {
        name:"Pawn promotion",
            method:function(){
                chessGame.setHandler(pawnPromotionHandler);
                chessGame.setMode(noOverMode);
            }
    },
    {
        name:"Check",
            method:function(){
            chessGame.setHandler(checkHandler(true));
            chessGame.setMode(noOverMode);
        }
    },
    {
        name:"Check - defend",
        method:function(){
            chessGame.setHandler(checkHandler(false));
            chessGame.setMode(noOverMode);
        }
    },
    {
        name:"Checkmate",
            method:function(){
            positionHandler.validator=function(chess){return chess.in_checkmate()};
            chessGame.setHandler(positionHandler);
            chessGame.setMode(gameMode);
        }
    },
    {
        name:"Stalemate",
            method:function(){
            positionHandler.validator=function(chess){return chess.in_draw()};
            chessGame.setHandler(positionHandler);
            chessGame.setMode(gameMode);
        }
    },
    {
        name:"Castle",
            method:function(){
            positionHandler.validator=function(chess,move){return move.flags==='k'|| move.flags==='q'};
            chessGame.setHandler(positionHandler);
            chessGame.setMode(gameMode);
        }
    },
    {
        name:"En-passant",
            method:function(){
            chessGame.setHandler(enPassantHandler);
            chessGame.setMode(noOverMode);
        }
    }
]