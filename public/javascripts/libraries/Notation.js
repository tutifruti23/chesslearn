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
        firstMove:startMove,
        current:startMove,
        prev:function(){
            this.current=this.current.prev_move===null?this.current:this.current.prev_move;
        },
        next:function(){
            this.current=this.current.next_moves.length>0?this.current.next_moves[0]:this.current;

        },
        setCurrent:function(move){
            this.current=move;
        },
        newMove:function(move,position){
            let m=this.current.newMove(move,position);
            this.current=m;
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
            $('#not').on('click','#'+id,function(){
                list.setCurrent(move);
            });
            let x = elem.get(0).outerHTML;

            return x;
        },
        getNotation:function(){
            return this.getAllMoves(this.firstMove,null);
        },getAllMoves:function(move,mainMove){
            let res= mainMove==null || move!==mainMove ?this.displayMove(move) : '';
            if(move.mainLine)
                res+=move.next_moves.length===0?'':this.displayMove(move.next_moves[0]);
            else
                res+=move.next_moves.length===0?') ':this.displayMove(move.next_moves[0]);

            for(let i=1;i<move.next_moves.length;i++) {
                res+="(";
                res+=this.getAllMoves(move.next_moves[i],move.next_moves[0]);
            }
            if(move.next_moves.length>0)
                res+=this.getAllMoves(move.next_moves[0],move.next_moves[0]);
            return res;
        }

    };
    return list;
}
 function parseToMove(movesArray,prevMove,arrayIndex,chess){
     if(arrayIndex===movesArray.length-1)
         return;
     chess.move(movesArray[arrayIndex]);
     parseToMove(movesArray,prevMove.newMove(movesArray[arrayIndex].move,chess.fen()),++arrayIndex,chess)
 }

