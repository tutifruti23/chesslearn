const pgnParser = require('pgn-parser');

exports.pgnParse = function (pgn, callback) {
  pgnParser(function (err, parser) {
    callback(parser.parse(pgn));
  });
};

function parsedPgnToListMoves(parsedPgn) {
  for (let i = 0; i < parsedPgn.moves.length; i++) {
    console.log(parsedPgn.moves[i]);
    if (parsedPgn.moves[i]['ravs'] !== undefined) {
      console.log(parsedPgn.moves[i]['ravs'][0]);
    }
  }
}
