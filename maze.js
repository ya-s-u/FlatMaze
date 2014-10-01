$(function(){

  var Maze = $('#canvas');
  var BlockSize = 20;
  var StrokeSize = 6;

  var Wall = new Array();

  var Direction = new Array(4);

  function init(){
    w = $("#wrapper").width() - ($("#wrapper").width()%BlockSize);
    h = $("#wrapper").height() - ($("#wrapper").height()%BlockSize);

    w -= 40;
    h -= 200;

    Maze.attr({
      width: w + StrokeSize,
      height: h + StrokeSize
    });

    BlockWidthCount = w / BlockSize;
    BlockHeightCount = h / BlockSize;
    BlockSum = BlockWidthCount*BlockHeightCount;

    for(var i=0; i<BlockSum; i++) {
      Wall.push({
        'r': 1, //RightBorder
        'b': 1, //BottomBorder
        'c': i  //ClusterNum
      });
    }

    Wall[BlockSum-1].r = 0;

    drawFrameLeft();
    drawFrameBottom();

    console.log(BlockSum);

    Direction = [1, BlockWidthCount];
  }

  function drawFrameLeft() {
    Maze.drawLine({
      strokeStyle: "#34495e",
      strokeWidth: StrokeSize,
      x1: StrokeSize/2,  y1: BlockSize,
      x2: StrokeSize/2,  y2: h+StrokeSize,
    })
  }

  function drawFrameBottom() {
    Maze.drawLine({
      strokeStyle: "#34495e",
      strokeWidth: StrokeSize,
      x1: 0,  y1: StrokeSize/2,
      x2: w+StrokeSize,  y2: StrokeSize/2,
    })
  }

  function drawRight(x, y) {
    x += StrokeSize/2;
    y += StrokeSize;

    Maze.drawLine({
      strokeStyle: "#34495e",
      strokeWidth: StrokeSize,
      x1: x+BlockSize,  y1: y,
      x2: x+BlockSize,  y2: y+BlockSize,
    })
  }

  function drawBottom(x, y) {
    x += StrokeSize;
    y += StrokeSize/2;

    Maze.drawLine({
      strokeStyle: "#34495e",
      strokeWidth: StrokeSize,
      x1: x,  y1: y+BlockSize,
      x2: x+BlockSize,  y2: y+BlockSize,
    })
  }

  function drawCorner(x, y) {
    x += StrokeSize/2;
    y += StrokeSize/2;

    Maze.drawRect({
      fillStyle: '#34495e',
      x: x+BlockSize, y: y+BlockSize,
      width: StrokeSize,
      height: StrokeSize
    });
  }

  function printCluster(x, y, c) {
    x += StrokeSize/2;
    y += StrokeSize/2;

    Maze.drawText({
      fillStyle: '#9cf',
      x: x+10, y: y+10,
      fontSize: 8,
      fontFamily: 'Verdana, sans-serif',
      text: c
    });
  }

  function connect(i1, i2) {
    var n1 = Wall[i1].c;
    var n2 = Wall[i2].c;

    if(n1 < n2) {
      var s = n1;
      var l = n2;
    } else {
      var s = n2;
      var l = n1;
    }

    for(var i=0; i<BlockSum; i++) {
      if(Wall[i].c == l) Wall[i].c = s;
    }

    if(i1-i2 == -1) {
      Wall[i1].r = 0;
    } else {
      Wall[i1].b = 0;
    }
  }

  function checkFinish() {
    for(var i=0; i<BlockSum; i++) {
      if(Wall[i].c != 0) return 0;
    }

    return 1;
  }

  function makeMaze() {
    init();

    while(1) {
      var r = ~~(Math.random()*(BlockSum-1-1));
      var d;

      if(r == BlockSum-1) continue; // 右下

      if(r >= BlockSum-BlockWidthCount) { // 下端
        d = Direction[0];
      } else if(r%BlockWidthCount == BlockWidthCount-1) { // 右端
        d = Direction[1];
      } else {
        d = Direction[~~(Math.random()*(2))];
      }

      if(Wall[r].c != Wall[r+d].c) {
        connect(r, r+d);
      }

      if(checkFinish()) break;
    }

    for(var j=0; j<BlockHeightCount; j++) {
      for(var i=0; i<BlockWidthCount; i++) {
        var x = i*BlockSize;
        var y = j*BlockSize;
        var n = j*BlockWidthCount+i;

        if(Wall[n].r) drawRight(x,y);
        if(Wall[n].b) drawBottom(x,y);
        if(!Wall[n].r && !Wall[n].b) drawCorner(x,y);

        //printCluster(x, y, Wall[n].c);
      }
    }
  }

  $(window).load(function () {
    makeMaze();
  })

  $(window).resize(function() {
    makeMaze();
  });


})
