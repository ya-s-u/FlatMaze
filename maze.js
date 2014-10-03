$(function(){

  var Maze = $('#canvas');
  var BlockSize = 20;
  var StrokeColor = '#bdaca2';
  var StrokeSize = 6;
  var BackgroundColor = '#fbf8ef';
  var SolverColor = '#e95937';
  var Title = $('h1');

  function init(){
    Maze.clearCanvas();

    Wall = new Array();
    Direction = new Array(4);

    w = $("#wrapper").width() - ($("#wrapper").width()%BlockSize) - 60;
    h = $("#wrapper").height() - ($("#wrapper").height()%BlockSize) - 140;

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

    drawGrid();
    drawStart();
    drawGoal();

    Direction = [1, BlockWidthCount];
  }

  function drawGrid() {
    for(var i=0; i<=BlockHeightCount; i++) {
      Maze.drawLine({
        strokeStyle: StrokeColor,
        strokeWidth: StrokeSize,
        x1: 0,  y1: i*BlockSize+StrokeSize/2,
        x2: w+StrokeSize,  y2: i*BlockSize+StrokeSize/2,
      })
    }

    for(var i=0; i<=BlockWidthCount; i++) {
      Maze.drawLine({
        strokeStyle: StrokeColor,
        strokeWidth: StrokeSize,
        x1: i*BlockSize+StrokeSize/2,  y1: 0,
        x2: i*BlockSize+StrokeSize/2,  y2: h+StrokeSize,
      })
    }
  }

  function drawStart() {
    Maze.drawLine({
      strokeStyle: BackgroundColor,
      strokeWidth: StrokeSize,
      x1: StrokeSize/2,  y1: StrokeSize,
      x2: StrokeSize/2,  y2: BlockSize,
    })
  }

  function drawGoal() {
    Maze.drawLine({
      strokeStyle: BackgroundColor,
      strokeWidth: StrokeSize,
      x1: w+StrokeSize/2,  y1: h-BlockSize+StrokeSize,
      x2: w+StrokeSize/2,  y2: h,
    })
  }

  function drawRight(x, y) {
    x += StrokeSize/2;
    y += StrokeSize;

    Maze.drawLine({
      strokeStyle: BackgroundColor,
      strokeWidth: StrokeSize,
      x1: x+BlockSize,  y1: y,
      x2: x+BlockSize,  y2: y+BlockSize-StrokeSize,
    })
  }

  function drawBottom(x, y) {
    x += StrokeSize;
    y += StrokeSize/2;

    Maze.drawLine({
      strokeStyle: BackgroundColor,
      strokeWidth: StrokeSize,
      x1: x,  y1: y+BlockSize,
      x2: x+BlockSize-StrokeSize,  y2: y+BlockSize,
    })
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

  function drawCircle(x, y) {
    Maze.drawArc({
      fillStyle: SolverColor,
      x: x+BlockSize/2+StrokeSize/2, y: y+BlockSize/2+StrokeSize/2,
      radius: BlockSize/2-StrokeSize/2
    });
  }

  function startMake() {
    loop = setInterval(function(){
      var r = ~~(Math.random()*(BlockSum-1-1));
      var d;

      if(r != BlockSum-1) {// 右下

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

        var x = (r%BlockWidthCount)*BlockSize;
        var y = Math.floor(r/BlockWidthCount)*BlockSize;

        if(!Wall[r].r) drawRight(x,y);
        if(!Wall[r].b) drawBottom(x,y);

        if(checkFinish()) stopMake();
      }
    } , 1);
  }

  function stopMake(){
    Title.text('Done,Solve?').css('cursor','pointer');

    Title.click(function(){
      Title.text('Solving...').css('cursor','none');
      drawCircle(0,0);
      startSolve();
    })

    clearInterval(loop);
  }

  function startSolve() {
    Solver = new Array();
    for(var i=0; i<BlockWidthCount; i++) {
      for(var j=0; j<BlockHeightCount; j++) {
        Solver[i][j] = {
          's': 0, //Status 0:none 1:open -1:close
          'c': 0, //Cost
          'h': Math.sqrt((BlockWidthCount-i)*(BlockHeightCount-j))  //Heuristic
        };
      }
    }

    var x=0;
    var y=0;
    var n=0;

    solve = setInterval(function(){
      n = x + y*BlockWidthCount;
      console.log(n);

      if(!Wall[n].r) {
        x++;
      } else if(!Wall[n].b) {
        y++;
      }

      drawCircle(x*BlockSize,y*BlockSize);

      if(Wall[n].r && Wall[n].b) stopSolve();
      if(x==BlockWidthCount-1 && y==BlockHeightCount-1) stopSolve();
    } , 1);
  }

  function stopSolve(){
    Title.text('Solved:)').css('cursor','none');
    clearInterval(solve);
  }

  function main() {
    init();
    startMake();
  }

  $(window).load(function () {
    main();
  })

  var timer = false;
  $(window).resize(function() {
    if (timer !== false) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      main();
    }, 100);
  });

})
