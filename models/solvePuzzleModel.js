let db = require('./firebase/adminFirebase').db;
function newRankings(player1Rating, player2Rating, k1, k2, score) {
  score = parseInt(score);
  let diff = player2Rating - player1Rating;
  let diffPrepared = diff > 400 ? 400 : diff < -400 ? -400 : diff;
  let WE1 = 1 / (1 + 10 ** (diffPrepared / 400));
  let WE2 = 1 - WE1;
  let newP1Rating, newP2Rating;
  switch (score) {
    case 1:
      newP1Rating = player1Rating + WE2 * k1;
      newP2Rating = player2Rating - WE2 * k2;
      break;
    case 0:
      newP1Rating = player1Rating + (WE2 - WE1) * k1;
      newP2Rating = player2Rating + (WE1 - WE2) * k2;
      break;
    case -1:
      newP1Rating = player1Rating - WE1 * k1;
      newP2Rating = player2Rating + WE1 * k2;
      break;
    default:
      return;
  }
  newP1Rating = Math.round(newP1Rating);
  newP2Rating = Math.round(newP2Rating);
  return { r1: newP1Rating, r2: newP2Rating };
}
exports.solvePuzzle = function (puzzleDocId, userRanking, score, callback) {
  let ratings;
  let sfDocRef = db.collection('puzzles').doc(puzzleDocId);

  db.runTransaction(function (transaction) {
    return transaction.get(sfDocRef).then(function (sfDoc) {
      if (!sfDoc.exists) {
        throw 'Document does not exist!';
      }
      let data = sfDoc.data();
      let puzzleRanking = data.rating;
      let newCount = data.attempts + 1;
      ratings = newRankings(userRanking, puzzleRanking, 20, 10, score);
      transaction.update(sfDocRef, { attempts: newCount, rating: ratings.r2 });
    });
  })
    .then(function () {
      callback(true, ratings.r1);
    })
    .catch(function (err) {
      console.log(err);
      callback(false);
    });
};
exports.getPuzzle = function (puzzleId, callback) {
  db.collection('puzzles')
    .doc(puzzleId)
    .get()
    .then(function (doc) {
      let puzzle = doc.data();
      callback(puzzle);
    });
};
exports.updatePuzzleRating = function (puzzleId, rating, callback) {};
