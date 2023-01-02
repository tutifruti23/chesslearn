function Move(_move, _position, _prev, _mainLine, _halfMove, _specialInfo) {
  var handler = this;
  this.mainLine = _mainLine === undefined ? true : _mainLine;
  this.move = _move;
  this.displayName = '';
  this.position = _position;
  this.next_moves = [];
  this.prev_move = _prev;
  this.halfMoveNumber = _halfMove === undefined ? 0 : _halfMove;
  this.specialInfo = _specialInfo === undefined ? '' : _specialInfo;
  this.newMove = function (move, position, specialInfo) {
    for (var i = 0; i < handler.next_moves.length; i++) {
      if (handler.next_moves[i].move === move) return handler.next_moves[i];
    }
    var isMainLine = handler.next_moves.length === 0 && handler.mainLine;
    var newMove = new Move(move, position, handler, isMainLine, handler.halfMoveNumber + 1, specialInfo);

    handler.next_moves.push(newMove);
    return newMove;
  };
}
var first = new Move('', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', null);
var listMoves = new Vue({
  el: '.app',
  data: {
    firstMove: null,
    current: null,
  },
  methods: {
    prev: function () {
      this.current = this.current.prev_move === null ? this.current : this.current.prev_move;
      return this.current;
    },
    next: function () {
      this.current = this.current.next_moves.length > 0 ? this.current.next_moves[0] : this.current;
      return this.current;
    },
    setCurrent: function (move) {
      this.current = move;
      return this.current;
    },
    init: function (position) {
      var firstMove = new Move('', position, null);
      this.firstMove = firstMove;
      this.current = firstMove;
    },
    newMove: function (move, position) {
      var m = this.current.newMove(move, position);
      this.current = m;
    },
    displayMove: function (move, mainElem) {
      var res = '';
      var id =
        'move' +
        Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, '')
          .substr(2, 20);
      var elem = $('<span></span>');
      if (move.mainLine) {
        elem.addClass('mainLine');
      }
      if (move === this.current) elem.addClass('currentMove');
      elem.addClass('singleMove');
      elem.attr('id', id);
      if (Math.round(move.halfMoveNumber) > 0 && move.halfMoveNumber % 2 === 1) {
        res += Math.round(move.halfMoveNumber / 2).toString() + '.';
      } else if (!move.mainLine && move !== move.prev_move.next_moves[0]) {
        res += Math.round(move.halfMoveNumber / 2).toString() + '... ';
      }
      res += move.move + move.specialInfo + ' ';
      elem.html(res);
      mainElem.on('click', '#' + id, function () {
        listMoves.setCurrent(move);
      });
      var x = elem.get(0).outerHTML;

      return x;
    },
    getNotation: function () {
      return this.getAllMoves(this.firstMove, null);
    },
    getAllMoves: function (move, mainMove, mainElem) {
      var res = mainMove == null || move !== mainMove ? this.displayMove(move) : '';
      if (move.mainLine) res += move.next_moves.length === 0 ? '' : this.displayMove(move.next_moves[0], mainElem);
      else res += move.next_moves.length === 0 ? ') ' : this.displayMove(move.next_moves[0], mainElem);

      for (var i = 1; i < move.next_moves.length; i++) {
        res += '(';
        res += this.getAllMoves(move.next_moves[i], move.next_moves[0], mainElem);
      }
      if (move.next_moves.length > 0) res += this.getAllMoves(move.next_moves[0], move.next_moves[0], mainElem);
      return res;
    },
  },
});
