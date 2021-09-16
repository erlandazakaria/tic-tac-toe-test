let playerA = true;
let playerB = false;

let playerARows = [];
let playerBRows = [];

let numberOfBoard = 0;
let numberOfWin = 0;

function deletePreviousBoard() {
  let cols = document.getElementsByClassName("board-col");
  while(cols.length > 0){
    cols[0].parentNode.removeChild(cols[0]);
  }
  let rows = document.getElementsByClassName("board-row");
  while(rows.length > 0){
    rows[0].parentNode.removeChild(rows[0]);
  }
}

function clearError() {
  document.getElementById("number-of-board-err").innerHTML = "";
  document.getElementById("number-of-win-err").innerHTML = "";
}

function resetTurn() {
  playerA = true;
  playerB = false;
  playerARows = [];
  playerBRows = [];
  document.getElementById("match-result").innerHTML = ""
}

function checkHorizontal() {

}

function checkWin(player, move) {
  let moveArr = move.split(",").map(mv => parseInt(mv, 10));
  let need = numberOfWin - 1;
  let winHorizontal = []
  for(let i = 1; i < numberOfWin; i++) {
    let behind = need - i;
    //+
    if(behind === 0) {
      let incHorizontal = [];
      for(let j = 1; j < numberOfWin; j++) {
        incHorizontal.push(`${moveArr[0]},${moveArr[1] + j}`)
      }
      winHorizontal.push(incHorizontal)
    } else {
      let incHorizontal = [];
      // for(let j=moveArr[1] + i; j > moveArr[1]-numberOfWin + i; j--) {
      for(let j=moveArr[1] + i; j >= moveArr[1]-behind; j--) {
        if(j !== moveArr[1]) {
          incHorizontal.push(`${moveArr[0]},${j}`)
        }
      }
      winHorizontal.push(incHorizontal)
    }
    //-
    if(behind === 0) {
      let incHorizontal = [];
      for(let j = -1; j > -numberOfWin; j--) {
        incHorizontal.push(`${moveArr[0]},${moveArr[1] + j}`)
      }
      winHorizontal.push(incHorizontal)
    } else {
      let incHorizontal = [];
      for(let j=moveArr[1] - i; j <= moveArr[1] + behind; j++) {
        if(j !== moveArr[1]) {
          incHorizontal.push(`${moveArr[0]},${j}`)
        }
      }
      winHorizontal.push(incHorizontal)
    }
  }
  
  if(player === "A") {
    // check horizontal 
    let isWinHorizontal = winHorizontal.map(hor => {
      let isTrue = 0;
      hor.forEach(h => {
        if(playerARows.includes(h)) {
          isTrue = isTrue + 1
        }
      })
      return isTrue === hor.length
    })

    if(isWinHorizontal.includes(true)) {
      return true
    }
  } else if(player === "B") {
    // check horizontal 
    let isWinHorizontal = winHorizontal.map(hor => {
      let isTrue = 0;
      hor.forEach(h => {
        if(playerBRows.includes(h)) {
          isTrue = isTrue + 1
        }
      })
      return isTrue === hor.length
    })

    if(isWinHorizontal.includes(true)) {
      return true
    }
  }

  return false 
}

function checkDraw() {
  let totalMove = playerARows.length + playerBRows.length;
  if(totalMove === numberOfBoard*numberOfBoard) {
    document.getElementById("match-result").innerHTML="DRAW"
  }
}

function checkDuplicateMove(move) {
  if(playerARows.includes(move)) {
    return true
  }
  if(playerBRows.includes(move)) {
    return true
  }
  return false
}

function turn(board) {
  let player=null;
  const isDuplicateMove = checkDuplicateMove(board);
  if(isDuplicateMove) return;
  if(playerA) {
    playerA=false; playerB=true;
    player="A";
    document.getElementById(board).innerHTML="O"
    playerARows.push(board)
  } else {
    playerA=true; playerB=false;
    player="B";
    document.getElementById(board).innerHTML="X"
    playerBRows.push(board)
  }

  checkDraw();
  let isWin = checkWin(player, board);
  if(isWin) {
    document.getElementById("match-result").innerHTML=`Player ${player} WIN`
  }
}

function onstart() {
  numberOfBoard = parseInt(document.getElementById("number-of-board").value, 10);
  numberOfWin = parseInt(document.getElementById("number-of-win").value, 10);

  clearError();

  if(numberOfBoard < 3) {
    document.getElementById("number-of-board-err").innerHTML = "Number of Board minimum 3";
    return;
  } 
  
  if(numberOfWin < 3) {
    document.getElementById("number-of-win-err").innerHTML = "Row to Win minimum 3"
    return;
  } 

  deletePreviousBoard();
  resetTurn();

  for(let i=0; i < numberOfBoard; i++) {
    let tempRow=document.createElement("div");
    tempRow.id = `board-row${i+1}`;
    tempRow.className = "board-row";
    document.getElementById("board-container").append(tempRow);
    for(let j=0; j < numberOfBoard; j++) {
      let tempCol=document.createElement("div");
      tempCol.id = `${i+1},${j+1}`
      tempCol.className = "board-col"
      tempCol.addEventListener("click", () => turn(`${i+1},${j+1}`))
      document.getElementById(`board-row${i+1}`).append(tempCol)
    }
  }
}