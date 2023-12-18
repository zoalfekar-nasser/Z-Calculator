const root = document.documentElement;

const numbers = document.querySelectorAll(".number");

const operators = document.querySelectorAll(".op");

const percent = document.querySelector(`[data-mission="percentage"]`);

const clearAllButton = document.querySelector(`[data-mission="clear-all"]`);

const clearButton = document.querySelector(`[data-mission="clear"]`);

const equalButton = document.querySelector(`.eqaul`);

const disabledItems = document.querySelectorAll("[data-disable]");

const monitorContainer = document.querySelector(".mo-content");

const sum = document.querySelector(".sum");

const dot = document.querySelector(".dot");

let strSum = "";

function handleNumberClick() {
  const number = this;

  monitorContainer.append(number.getAttribute("data-num"));

  strSum += number.getAttribute("data-num");

  sum.innerHTML = Number.isInteger(eval(strSum))
    ? eval(strSum)
    : eval(strSum).toFixed(2) || "";
}

function handleDotClick() {
  if (monitorContainer.innerHTML !== "") {
    strSum += dot.getAttribute("data-value");

    monitorContainer.append(dot.getAttribute("data-value"));

    sum.append(dot.getAttribute("data-value"));

    dot.style.cssText = `
    pointer-events: none;
    color: var(--disabled);
    `;
  }
}
function reEnableDotClick() {
  if (dot.style.pointerEvents === "none") {
    dot.style.cssText = `
          pointer-events: auto;
          color: var(--clr-text);
          `;
  }
}

function handleOperatorClick() {
  const op = this;

  //* Check If the Monitor is not empty or if the Monitor IS EMPTY And The Target Operator Is Minus

  //* These 2 Conditions are Empossible to be true together

  if (
    monitorContainer.innerHTML !== "" ||
    (monitorContainer.innerHTML === "" && op.getAttribute("data-value") === "-")
  ) {
    let opIcon = document.createElement("i");

    opIcon.className = `${op.getAttribute("data-op")}`;

    opIcon.style.cssText = `
        font-size: 18px;
        margin-inline: 5px;
        color: rgb(var(--clr));
        `;

    //* So Here we test The First Condition

    if (monitorContainer.innerHTML !== "") {
      //* Here We Check if The Last Element in the monitor is An Operoator

      if (monitorContainer.lastChild.nodeType === 1) {
        let lastOp = monitorContainer.lastElementChild;

        //* If This Operator Is The Percent Operator We Will The Target Operator Normally

        if (lastOp.classList.contains("fa-percent")) {
          monitorContainer.append(opIcon);
          strSum += op.getAttribute("data-value");
        } else {
          //* And If its Not The Percent Operator We Will Check On Several Conditions

          //* The First One Is If The Last Operator Is '*' or '/' AND The Target Operator is '-' To Mange The Multiply And Divide on Negative Numbers

          if (
            (lastOp.classList.contains("fa-multiply") ||
              lastOp.classList.contains("fa-divide")) &&
            op.getAttribute("data-value") === "-"
          ) {
            monitorContainer.append(opIcon);

            strSum += "-";
          } else if (
            !(lastOp.classList.contains("fa-minus") && strSum.length === 1)
          ) {
            //* We Check Here If There Is No A Single Minus in the Screen

            //* Here If There is a Minus And '*' or '-' Behind it We Will Change Them By The Target Operator

            if (
              lastOp.classList.contains("fa-minus") &&
              lastOp.previousSibling.nodeType === 1
            ) {
              lastOp.previousElementSibling.className = opIcon.className;

              lastOp.remove();

              strSum = strSum.slice(0, -2) + op.getAttribute("data-value");
            } else {
              monitorContainer.lastElementChild.className = opIcon.className;

              strSum = strSum.slice(0, -1) + op.getAttribute("data-value");
            }
          }
        }
      } else {
        monitorContainer.append(opIcon);
        strSum += op.getAttribute("data-value");
      }
    } else {
      //* This Is The Second Condition in The Main If 'monitorContainer.innerHTML === "" && op.getAttribute("data-value") === "-"'
      monitorContainer.append(opIcon);

      strSum += "-";
    }

    reEnableDotClick();
  }
}

function handlePercentButtonClick() {
  if (monitorContainer.innerHTML !== "") {
    const percentIcon = document.createElement("i");

    percentIcon.className = `${percent.getAttribute("data-op")}`;

    percentIcon.style.cssText = `
    font-size: 18px;
    margin-inline: 5px;
    color: rgb(var(--clr));
    `;

    if (monitorContainer.lastChild.nodeType === 1) {
      const lastOp = monitorContainer.lastElementChild;

      if (lastOp.classList.contains("fa-percent")) {
        monitorContainer.append(percentIcon);
        strSum += percent.getAttribute("data-value");
        sum.innerHTML = eval(strSum) || "";
      } else {
        if (strSum.length !== 1) {
          lastOp.className = percentIcon.className;
          strSum = strSum.slice(0, -1) + percent.getAttribute("data-value");
          sum.innerHTML = eval(strSum) || "";
        }
      }
    } else {
      monitorContainer.append(percentIcon);
      strSum += percent.getAttribute("data-value");
      sum.innerHTML = eval(strSum) || "";
    }
  }
}

function handleClearAllButtonClick() {
  monitorContainer.innerHTML = "";

  strSum = "";

  sum.innerHTML = eval(strSum) || "";

  sum.classList.remove("final-sum");

  disabledItems.forEach(function (item) {
    item.style.pointerEvents = "auto";
    if (item.classList.contains("colored")) {
      item.style.color = "rgba(var(--clr))";
    } else {
      item.style.color = "var(--clr-text)";
    }
  });

  monitorContainer.style.opacity = "1";
}

function handleClearButtonClick() {
  let strSumLength = strSum.length;

  //* Check If The Monitor is Not Empty

  if (monitorContainer.lastChild !== null) {
    //* Check If The Monitor Has Only One Character
    if (monitorContainer.lastChild.data === ".") {
      reEnableDotClick();
    }

    if (strSumLength === 1) {
      strSum = "";
      sum.innerHTML = "";
      monitorContainer.innerHTML = "";
    } else {
      //* Check If The Last Character is an Element
      if (monitorContainer.lastChild.nodeType === 1) {
        if (monitorContainer.lastChild.classList.contains("fa-percent")) {
          strSum = strSum.slice(0, strSumLength - 4);
        } else {
          strSum = strSum.slice(0, -1);
        }

        monitorContainer.lastChild.remove();
        sum.innerHTML = eval(strSum) || "";
      } else {
        monitorContainer.lastChild.remove();
        strSum = strSum.slice(0, -1);
        sum.innerHTML = eval(strSum) || "";
      }
    }
  }
  // if (monitorContainer.lastChild.nodeValue === ".") {
  // reEnableDotClick();

  // }
}

function handleEqualsButtonClick() {
  if (eval(strSum) !== undefined) {
    sum.classList.add("final-sum");

    monitorContainer.style.opacity = "0";

    monitorContainer.innerHTML = "";

    disabledItems.forEach(function (item) {
      item.style.cssText = `
          pointer-events: none;
          color: var(--disabled);
        `;
    });
  }
}

//* Switch Between Dark And Light Modes

const switchMode = document.querySelector(".mode-icon");

const icon = document.querySelector(".mode-icon i");

const iconToolTip = document.querySelector(".mode-icon .tool-tip");

const calcBody = document.querySelector(".calc-body");

const moonIconClass = "fa-moon";

const sunIconClass = "fa-sun";

const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

if (prefersLight) {
  root.classList.add("light");

  iconToolTip.innerHTML = "Switch To Dark Mode";

  icon.classList.remove(sunIconClass);

  icon.classList.add(moonIconClass);

  calcBody.classList.add("light-shadow");
}

function handleSwitchModeClick() {
  //* Animation On click

  icon.style.animation = "rotate ease-out .5s forwards";

  setTimeout(function () {
    icon.style.animation = "none";
  }, 500);

  //* Enable Dark Or Light Mode

  root.classList.toggle("light");

  if (root.classList.contains("light")) {
    iconToolTip.innerHTML = "Switch To Dark Mode";
  } else {
    iconToolTip.innerHTML = "Switch To Light Mode";
  }

  calcBody.classList.toggle("light-shadow");

  //* Change Moon Icon Or Sun Icon

  if (icon.classList.contains(moonIconClass)) {
    icon.classList.remove(moonIconClass);

    icon.classList.add(sunIconClass);
  } else if (icon.classList.contains(sunIconClass)) {
    icon.classList.remove(sunIconClass);

    icon.classList.add(moonIconClass);
  }
}

//* Change Main Color

const colorsButton = document.querySelector(".colors-icon");

const colorsContainer = document.querySelector(".colors-container");

const colors = document.querySelectorAll(".color");

function handleColorsButtonClick() {
  colorsContainer.classList.toggle("open");
}

function handleColorsClick(event) {
  event.target.classList.add("active");

  root.style.setProperty("--clr", `${event.target.getAttribute("data-color")}`);

  colors.forEach(function (color) {
    if (color !== event.target && color.classList.contains("active")) {
      color.classList.remove("active");
    }
  });
}

//* Add Event Listeners

numbers.forEach((number) =>
  number.addEventListener("click", handleNumberClick)
);

dot.addEventListener("click", handleDotClick);

operators.forEach((op) => op.addEventListener("click", handleOperatorClick));

percent.addEventListener("click", handlePercentButtonClick);

clearAllButton.addEventListener("click", handleClearAllButtonClick);

clearButton.addEventListener("click", handleClearButtonClick);

equalButton.addEventListener("click", handleEqualsButtonClick);

switchMode.addEventListener("click", handleSwitchModeClick);

colorsButton.addEventListener("click", handleColorsButtonClick);

colors.forEach((color) => color.addEventListener("click", handleColorsClick));
