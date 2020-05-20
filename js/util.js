'use strict'
console.log('util.js');

function renderCell(i,j, value) {
    var elCell = document.querySelector(`#cell${i}-${j}`);
    elCell.innerText = value;
  };