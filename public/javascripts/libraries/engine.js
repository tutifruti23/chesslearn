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
      info['pv']=infoSplit[1];
      for(let i=1;i<params.length;i=i+2){
          info[params[i]]=params[i+1];
      }
      return info;
    };
    this.goDepth=function (fen,depth) {
        if(engine===undefined){
            return;
        }
        console.log(fen);
        uciCmd('position fen '+fen);
        uciCmd('go depth '+depth.toString());

    };
    this.goAnaliseDepth=function (fen,depth,lines){
        setAnalise(lines);
        this.goDepth(fen,depth);
    };

}

