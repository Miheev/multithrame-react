!function() {
  var a = { a: 88 };
  var b = { b: 99 };

  var c1 = { c1: 11, c10: 110 };
  var c2 = { c2: 22 };
  var c3 = { c3: 33 };


  var di = {
    s1: {}, s2: {}, get(n) {
      return this[n];
    },
  };

  console.time();

  let s1 = di.get('s1');
  let s2 = di.get('s2');

  s1.c1 = c1.c1;
  s1.c10 = c1.c10;
  s2.c1 = c1.c1;


  var d = { ...c1, ...c2, ...c3 };
  console.timeEnd();
}();

!function() {
  var a = { a: 88 };
  var b = { b: 99 };

  var c1 = { c1: 11, c10: 110 };
  var c2 = { c2: 22 };
  var c3 = { c3: 33 };


  var di = {
    s1: {}, s2: {}, get(n) {
      return this[n];
    },
  };

  console.time();

  var s1 = di.get('s1');
  var s2 = di.get('s2');

  s1.c1 = c1.c1;
  s1.c10 = c1.c10;
  s2.c1 = c1.c1;


  var d = { ...c1, ...c2, ...c3, s1, s2 };
  console.timeEnd();
  console.log(d);
}();
