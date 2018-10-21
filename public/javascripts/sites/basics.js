let chessGame=ChessGame('board');
let chapterRewinder=new Vue({
    el:'#left-menu',
    data:{},
    methods:{
        setMode:function(name){},
        setHandler:function(chapter){

            switch(chapter){
                case'b':
                case'n':
                case'k':
                case'r':
                case'q':

                    chessGame.setHandler(pawnsCapturingEventHandler(chapter));
                    chessGame.setMode(oneColorMovesMode);
                    break;
                case'p':
                    chessGame.setMode(gameMode);
                    break;
                case'pPromotion':
                    break;
            }
            chessGame.handlerInit();

        }
    },
    computed:{}
});
let guideAndTips=new Vue({
    el:'#guide',
    data:{},
    methods:{}
});

