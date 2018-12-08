 function Move(_move,_position,_prev,_mainLine,_halfMove,_specialInfo){
    let handler=this;
    this.mainLine=_mainLine===undefined?true:_mainLine;
    this.move=_move;
    this.displayName='';
    this.position=_position;
    this.next_moves=[];
    this.prev_move=_prev;
    this.halfMoveNumber=_halfMove===undefined?0:_halfMove;
    this.specialInfo=_specialInfo===undefined?'':_specialInfo;
    this.newMove=function(move,position,specialInfo){
        for(let i=0;i<handler.next_moves.length;i++){
            if(handler.next_moves[i].move===move)
                return handler.next_moves[i];
        }
        let isMainLine=handler.next_moves.length===0&&handler.mainLine;
        let newMove=new Move(move,position,handler,isMainLine,handler.halfMoveNumber+1,specialInfo);

        handler.next_moves.push(newMove);
        return newMove;
    }
}
function ListMoves(startMove){

    let list={
        tags:{
            Event:"?",
            Date:'?'
        },
        firstMove:startMove,
        current:startMove,
        listener:null,
        prev:function(){
            this.setCurrent(this.current.prev_move===null?this.current:this.current.prev_move);
        },
        next:function(){
            this.setCurrent(this.current.next_moves.length>0?this.current.next_moves[0]:this.current);

        },hasNextMoves:function(){
            return this.current.next_moves.length !==0;
        },
        setCurrent:function(move){
            this.current=move;
            if(this.listener!==null){
                this.listener(this.current);
            }
        },enableKeysNavigation:function(){
            let handler=this;
            $('body').bind('keypress',handler.keysNavigationFunction);
        },disableKeysNavigation:function(){
            let handler=this;
            $('body').unbind('keypress',handler.keysNavigationFunction);
        },
        keysNavigationFunction:function(event){
            if(event.keyCode === 37) { // left
                list.prev();
            }
            else if(event.keyCode === 39) { // right
                list.next();
            }
        },
        newMove:function(move,position){
            this.current=this.current.newMove(move,position);
        },displayRawMove:function(move){
            let res='';
            if(Math.round(move.halfMoveNumber)>0&&move.halfMoveNumber%2===1){
                res+=(Math.round(move.halfMoveNumber/2)).toString()+'.';
            }else if(!move.mainLine&&move!==move.prev_move.next_moves[0]){
                res+=(Math.round(move.halfMoveNumber/2)).toString()+'... ';
            }
            res+=move.move+move.specialInfo+' ';
            return res;
        },
        displayMove:function(move){
            let res='';
            let id='move'+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 20);
            let elem=$('<span></span>');
            if(move.mainLine){
                elem.addClass('mainLine');
            }
            if(move===this.current)
                elem.addClass('currentMove');
            elem.addClass('singleMove');
            elem.attr('id', id);
            if(Math.round(move.halfMoveNumber)>0&&move.halfMoveNumber%2===1){
                res+=(Math.round(move.halfMoveNumber/2)).toString()+'.';
            }else if(!move.mainLine&&move!==move.prev_move.next_moves[0]){
                res+=(Math.round(move.halfMoveNumber/2)).toString()+'... ';
            }
            res+=move.move+move.specialInfo+' ';
            elem.html(res);
            $('body').on('click','#'+id,function(){
                list.setCurrent(move);
            });
            return elem.get(0).outerHTML;
        },
        getRawNotation:function(){
            return this.getAllMoves(this.firstMove,null,true);
        },
        getNotation:function(){
            return this.getAllMoves(this.firstMove,null);
        },getAllMoves:function(move,mainMove,rawNotation){
            let res= mainMove==null || move!==mainMove ?(rawNotation?this.displayRawMove(move):this.displayMove(move)) : '';
            if(move.mainLine)
                res+=move.next_moves.length===0?'':(rawNotation?this.displayRawMove(move.next_moves[0]):this.displayMove(move.next_moves[0]));
            else
                res+=move.next_moves.length===0?') ':(rawNotation?this.displayRawMove(move.next_moves[0]):this.displayMove(move.next_moves[0]));

            for(let i=1;i<move.next_moves.length;i++) {
                res+="(";
                res+=this.getAllMoves(move.next_moves[i],move.next_moves[0],rawNotation);
            }
            if(move.next_moves.length>0)
                res+=this.getAllMoves(move.next_moves[0],move.next_moves[0],rawNotation);
            return res;
        },setListener:function(listener){
            this.listener=listener;
        }

    };
    return list;
}
 function parseToMove(movesArray,prevMove,arrayIndex,chess){
     if(arrayIndex===movesArray.length-1)
         return;
     chess.move(movesArray[arrayIndex]);
     parseToMove(movesArray,prevMove.newMove(movesArray[arrayIndex].move,chess.fen()),++arrayIndex,chess);
 }
let NotationMethods= {
    chess:new Chess(),
    newPosition: function (listMoves, pos) {
        const newFirstMove=new Move('',pos,null);
        listMoves.firstMove=newFirstMove;
        listMoves.current=newFirstMove;
    },
    newListMoves:function(pos){
        return ListMoves(new Move('',pos,null));
    },
    listMovesToPgn(listMoves){
        let pgn="";
        Object.keys(listMoves.tags).forEach(function(key){
           pgn+='['+key +' "'+listMoves.tags[key]+'"] \n';
        });
        pgn+='\n';
        pgn+=listMoves.getRawNotation();
        return pgn;
    },arrayMovesToListMoves(pos,listMoves,arrayMoves){
        this.newPosition(listMoves,pos);
        this.chess.load(pos);
        for(let i=0;i<arrayMoves.length;i++){
            this.chess.move(arrayMoves[i].move);
            listMoves.newMove(arrayMoves[i].move,this.chess.fen());
        }
        listMoves.current=listMoves.firstMove;
    }
};
