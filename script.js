"use strict";

let progressBar =  document.querySelector(".progress-bar");
let bigCup = document.querySelector(".cup");
let state = "idle";
/*
  Переменная state отвечает за текущее состсояние кофе-машины.
  Возможные значения:
    "idle" - ожидание
   "cooking" - готовка
   "ready" - кофе готов, но пока не забран.
  После забора коефе state возвращается в значение 'idle'
*/

function makeCoffee(name, price, element) {
  if(state != "idle") return;

  let balance = document.querySelector(".form-control");
  if(+balance.value >= price) {
    balance.value -= price;
    balance.style.backgroundColor = "";
    changeDisplayText(`Ваш ${name} готовится`);
    state = "cooking";
    
    let coffeeCup = element.querySelector("img");
    let cupSrc = coffeeCup.getAttribute("src");
    console.log(cupSrc);
    bigCup.setAttribute("src", cupSrc);
    bigCup.style.display = "inline";
    
    let readyPercent = 0;
    let cookingInterval = setInterval(function() {
      readyPercent++;  
      /*console.log(readyPercent);*/
      requestAnimationFrame(function() {
      bigCub.style.opacity = readyPercent + "%";
      progressBar.style.width = readyPercent + "%";
      });
      /*bigCup.style.opacity = readyPercent + '%';
      progressBar.style.width = readyPercent + "%";*/
      changeDisplayText(`Ваш ${name} готовится... ${readyPercent}%`);
      if( readyPercent >= 100) {
        clearInterval(cookingInterval);
        changeDisplayText(`Ваш ${name} готов!`);
        state = "ready";
        bigCup.style.cursor = "pointer";
        bigCup.onclick = function() {
          takeCoffee();
        }
      }
    }, 30);
    
  } else {
    balance.style.backgroundColor = "red";
    changeDisplayText("Недостаточно средств");
  }
}

function takeCoffee() {
  bigCup.style.display = "none";
  bigCup.style.opacity = 0;
  bigCup.style.cursor = "";
  
  progressBar.style.width = 0;
  
  changeDisplayText("Выберите кофе");
  bigCup.onclick = null;
  state = "idle";
}
function changeDisplayText(message) {
  let displayText = document.querySelector(".display-text");
  displayText.innerHTML = message;
  }
  
//----------------Drag`n Drop-----------------------

let money = document.querySelectorAll(".money img");
//for(let i = 0; i <money.length; i++) {
// let bill = money[i];
//}
for(let bill of money) {
  bill.onmousedown = function(event) {
    takeMoney(event, bill);
  }
}

function takeMoney(event, bill) {
  event.preventDefault();
  
  let mouseX = event.clientX;
  let mouseY = event.clientY;
    bill.style.transform = "rotate(90deg)";
    
  let billCoords = bill.getBoundingClientRect();
  // console.log(billCoords);

  bill.style.position = "absolute";
  bill.style.top = mouseY - billCoords.width/2 + "px";
  bill.style.left = mouseX - billCoords.height/2 + "px";
  
  window.onmousemove = function(event) {
  let mouseX = event.clientX;
  let mouseY = event.clientY;
  bill.style.top = mouseY - billCoords.width/2 + "px";
  bill.style.left = mouseX - billCoords.height/2 + "px";
  }
  bill.onmouseup = function(event) {
    window.onmousemove = "null";
    if(inAtm(bill)) {
      let balance = document.querySelector(".form-control");
      balance.value = +balance.value + +bill.dataset.cost;
      bill.remove();
    }
  }
}

function inAtm(bill) {
  let atm = document.querySelector(".atm");
  let atmCoords = atm.getBoundingClientRect();
  let billCoords = bill.getBoundingClientRect();
  
  let atmLeftTopX = atmCoords.x;
  let atmLeftTopY = atmCoords.y;
  
  let atmLeftBottomX = atmCoords.x;
  let atmLeftBottomY = atmCoords.y + atmCoords.height/3;
  
  let atmRightTopX = atmCoords.x + atmCoords.width;
  let atmRightTopY = atmCoords.y;
  
  let billLeftTopX = billCoords.x;
  let billLeftTopY = billCoords.y;
  
  let billRightTopX = billCoords.x + billCoords.width;
  let billRightTopY = billCoords.y;
  /*console.log([atmLeftTopX, atmLeftTopY, atmLeftBottomX, atmLeftBottomY, atmRightTopX, atmRightTopY, billLeftTopX, billLeftTopY, billRightTopX, billRightTopY]);*/
  if (billLeftTopX > atmLeftTopX
    && billLeftTopY > atmLeftTopY
    && billLeftTopY < atmLeftBottomY
    && billRightTopX < atmRightTopX)
  {
    return true;
  } else {
    return false;
  }
}
//------------------------------------------------------------
let changeButton = document.querySelector(".change-button");
changeButton.onclick = function() {
  takeChange();
}

function takeChange() {
  let balance = document.querySelector(".form-control");
  if (balance.value >= 10) {
    balance.value -= 10;
    createCoin("10");
    return setTimeout(function() {
      takeChange();
    }, 300);
  } else if (balance.value >= 5) {
    balance.value -= 5;
     createCoin("5");
    return takeChange();
  } else if(balance.value >= 2) {
    balance.value -= 2;
     createCoin("2");
    return takeChange();
  } else if(balance.value >= 1) {
    balance.value -= 1;
     createCoin("1");
    return takeChange();
}
}
function createCoin(nominal) {
  let coinSrc = "";
  switch (nominal) {
    case "10":
      coinSrc = "img/10rub.png";
      break;
    case "5":
      coinSrc = "img/5rub.png";
      break;
    case "2":
      coinSrc = "img/2rub.png";
      break;
    case "1":
      coinSrc = "img/1rub.png";
      break;
    default:
      return console.error("Неправильный номинал монеты");
  }
  let coin = document.createElement("img");
  coin.setAttribute("src", coinSrc);
  coin.style.width = "50px";
  coin.style.height = "50px";
  coin.style.position = "absolute";
  let changeContainer = document.querySelector(".change-container");
  let containerCoords = changeContainer.getBoundingClientRect();
  coin.style.top = Math.floor(Math.random() * (containerCoords.height - 50)) + "px";
  coin.style.left = Math.floor(Math.random() * (containerCoords.width - 50)) + "px";
  coin.style.transition = "transform 300ms ease-in";
  coin.style.transform = "translateY(-40%)";
  setTimeout(function() {
   coin.style.transform = "translateY(0%)"; 
  }, 30);
  changeContainer.append(coin);
  /*внутрь и вначало - prepend
  рядом перед: before
  рядом после: after
  вместо - replaceWith
  */
  
}