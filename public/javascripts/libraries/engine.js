function Engine() {
    let engine;

    function uciCmd(cmd) {
        engine.postMessage(cmd);
    }
    this.init=function (callback){
        engine=undefined;
        engine=STOCKFISH();
        engine.onmessage=function(event){
           callback(event);
        };
        uciCmd('uci');
    };
    function setAnalise(lines){
        uciCmd('setoption name UCI_AnalyseMode value true');
        uciCmd('setoption name MultiPV value '+lines.toString());
    }
    this.parseAnaliseLine=function(line){
      let info={};
      let infoSplit=line.split(" pv ");

      let params=infoSplit[0].split(' ');

      info['pv']=infoSplit[1].split(' pvSan ')[0];
      for(let i=1;i<params.length;i=i+2){
          if(params[i]==='score')
              i++;
          info[params[i]]=params[i+1];
      }
      return info;
    };
    this.variantEngineLineToNotation=function(pv,position,numberOfFirstMove,cp,mate){
        let result="";
        let score=cp!==undefined?(cp/100).toFixed(2):'#'+mate;
        if(cp!==undefined && position.split(' ')[1]==='b')
            score=score*(-1);
        if(score>0)
            score='+'+score;
        result+=score+' ';
        let chess=new Chess();
        chess.load(position);
        let offSet=chess.turn()==='w'?0:1;
        let moves=pv.split(" ");

        if(offSet===1){
            result+=numberOfFirstMove+"... " ;
            numberOfFirstMove++;
            let match = moves[0].match(/([a-h][1-8])([a-h][1-8])([qrbk])?/);
            result+= chess.move({from: match[1], to: match[2], promotion: match[3]}).san+" ";
        }
        for(let i=offSet;i<moves.length-1;i=i+2){
            result+=numberOfFirstMove+". ";
            numberOfFirstMove++;
            let match = moves[i].match(/([a-h][1-8])([a-h][1-8])([qrbk])?/);
            let move=chess.move({from: match[1], to: match[2], promotion: match[3]});
            if(move)
                result+=move.san+" ";
            if(i+1<moves.length){
                let matchB = moves[i+1].match(/([a-h][1-8])([a-h][1-8])([qrbk])?/);
                let moveB= chess.move({from: matchB[1], to: matchB[2], promotion: matchB[3]});
                if(moveB)
                    result+=moveB.san+" ";
            }
        }
        chess=null;
        return result;
    };
    this.goDepth=function (fen,depth) {
        if(engine===undefined){
            return;
        }
        uciCmd('stop');
        uciCmd('position fen '+fen);
        uciCmd('go depth '+depth.toString());

    };
    this.goAnaliseDepth=function (fen,depth,lines){
        setAnalise(lines);
        this.goDepth(fen,depth);
    };

}

