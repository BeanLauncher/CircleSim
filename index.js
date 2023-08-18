var canvas = document.getElementById("SimCanvas");
var ctx = canvas.getContext("2d");

// Physical constants need to be predefined to avoid repetition in the functions
const k = 9.88 * (10**11);
const q = 1.6 * (10**-19);
const m = 1.67 * (10**-27);


var circles = [
  { x: 95, y: 25, radius: 10, color: "purple", isDragging: false, offsetX: 0, offsetY: 0 },
  {x: 95, y: 365, radius: 10, color: "black", isDragging: false, offsetX: 0, offsetY: 0 }
  
];


var center = { x: canvas.width * 3 / 5, y: canvas.height / 2 };

// Predefine the constants for the particles
var fixCharge = { x: canvas.width * 3 / 5, y: canvas.height / 2 , radius: 10, color: "red" };
var fixChargeRadius = 10;
var fixChargeColor = "red";
var fixChargeCenter = { x: canvas.width * 3 / 5, y: canvas.height / 2 };


var variCharge = {x: fixChargeCenter.x + variChargeDistance, y: canvas.height / 2, radius: 10, color: "blue"};

var variChargeRadius = 10;
var variChargeColor = "blue";
var variChargeDistance = 150;

var variChargeAngle = 1;
var variChargeSpeed = speedcalc();

function purpCircleX(circle) {
  var purpCircleX = circles[0].x
  return purpCircleX
};

function purpCircleY(circle) {
  var purpCircleY = circles[0].y;
  return purpCircleY;
};

function blackCircleX(circle) {
  var blackCircleX = circles[1].x;
  return blackCircleX;
}

function blackCircleY(circle) {
  var blackCircleY = circles[1].y;
  return blackCircleY;
}



function forceCalc (){
  var blackCircleX = circles[1].x;
  var blackCircleY = circles[1].y;
  
  // Check if the black circle is inside the animation borders
  if (blackCircleX >= (canvas.width / 4)) {
    var radcalc = ((Math.sqrt(Math.pow(((canvas.width * 3 / 5) - blackCircleX), 2) + Math.pow(((canvas.height / 2) - blackCircleY), 2))));
    var rad = (radcalc) * (10**-9);
    var force = (k * (q*q) / (rad * rad));
    return force.toPrecision(4); }
else {
    return "0";
  }
}

function voltCalc (){
  var purpCircleX = circles[0].x;
  var purpCircleY = circles[0].y;

  // Check if the purple circle is inside the animation borders
if (purpCircleX >= (canvas.width / 4)) {
  var radvcalc = (Math.sqrt(Math.pow(((canvas.width * 3 / 5) - purpCircleX), 2) + Math.pow(((canvas.height / 2) - purpCircleY), 2)));
  var radv = (radvcalc) * (10**-9);
  var VF = ((k * q*q) / radv);
  var eV = (VF / q);
  return eV.toPrecision(3);
  }
  else {
    return "0";
  }
};


function speedcalc(variChargeDistance) {
  var newspeed = 2500 / variChargeDistance;
  //variChargeSpeed = newspeed;
  return newspeed;
};


function velocitycalc(variChargeDistance){
  var n = Math.sqrt((k * (q*q) / (m * (variChargeDistance * (10**-9)))));
  // .tofixed allows me to control the accuracy of scientific notation. nessecary to avoid overflows
  let V = n;
  return V;
};

var slider = document.getElementById("distanceSlider"); // defines what the slider is
var output = document.getElementById("distanceValue"); // obtains the slider value based on HTML input

slider.addEventListener("input", function() {
  variChargeDistance = Number(slider.value); // Updates the variChargeDistance based on the slider value
  output.textContent = variChargeDistance; // Updates the displayed value
  clearCanvas();
});

function sizeCalc() {
  var blackCircleX = circles[1].x;
  var blackCircleY = circles[1].y;
  var radcalc = ((Math.sqrt(Math.pow(((canvas.width * 3 / 5) - blackCircleX), 2) + Math.pow(((canvas.height / 2) - blackCircleY), 2))));
  var rad = (radcalc) * (10**-10);
  var size = (k * (q*q) / (rad * rad)) * (10**13);
  return size;
}


var invisibleDistance = 80;

function drawForceArrow () { 
  var blackCircleX2 = circles[1].x;
  var gradient = Math.atan2(fixCharge.y - circles[1].y, fixCharge.x - circles[1].x);

  var invisibleEndpointX = circles[1].x - invisibleDistance * Math.cos(gradient);
  var invisibleEndpointY = circles[1].y - invisibleDistance * Math.sin(gradient);
  
  if (blackCircleX2 >= (canvas.width / 4)){
    ctx.save();
/*
There used to be a function here that would draw a line in between the arrowhead and the circle.
The issue was that I couldn't offset the arrowhead to be drawn on top of the line rather than in it.
In the end the solution was to remove the line drawing code to have just the arrowhead,
this significantly simplifies the code and is a completley acceptable abrstraction for the user.
  */
    var arrowSize = (Math.sqrt(size)) / 1.5; // Adjust the size of the arrowhead
    var arrowPoints = [
      { x: invisibleEndpointX + arrowSize * Math.cos(gradient + Math.PI / 6), y: invisibleEndpointY + arrowSize * Math.sin(gradient + Math.PI / 6) },
      { x: invisibleEndpointX + Math.cos(arrowSize), y: invisibleEndpointY +  Math.sin(arrowSize)},
      { x: invisibleEndpointX + arrowSize * Math.cos(gradient - Math.PI / 6), y: invisibleEndpointY + arrowSize * Math.sin(gradient - Math.PI / 6) }
    ];
    
    if (arrowPoints[1].x >= ((canvas.width) / 4)) {
      if (arrowPoints[0].x >= canvas.width / 4){
        if (arrowPoints[2].x >= canvas.width / 4) {
          if (arrowPoints[0].y <= canvas.height) {
            if(arrowPoints[2].y <= canvas.height) {
              if(arrowPoints[0].x <= canvas.width){
                if (arrowPoints[2].x <=canvas.width){
      ctx.fillStyle = "black"; 
      ctx.beginPath();
      ctx.moveTo(arrowPoints[0].x, arrowPoints[0].y );
      ctx.lineTo(arrowPoints[1].x, arrowPoints[1].y);
      ctx.lineTo(arrowPoints[2].x, arrowPoints[2].y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
            }
          }
        }
        }
      }
      }
    }
  }
} 

function drawCircle(circle) {
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI);
  ctx.fillStyle = circle.color;
  ctx.fill();
}

function drawLine() {
  /*
  This code is responiosble for drawing the line splitting the cavas into 2 sections.
  When originaly designing the canvas I was using HTML to offset the line to one part of the canvas.
  The issue was that my javascript code couldn't identify it as a boundry so i redifined the line here.
  This makes it so that the position of the line is more porperly defined as easy to use.
  */
  ctx.beginPath();
  ctx.moveTo(canvas.width / 4, 0);
  ctx.lineTo(canvas.width / 4, canvas.height);
  ctx.strokeStyle = "black";
  ctx.stroke();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circles.forEach(function(circle) {
    drawCircle(circle);
  });
  
  drawCircle({x: fixChargeCenter.x, y: fixChargeCenter.y, radius: fixChargeRadius, color: fixChargeColor });
  

  drawLine();
  

canvas.addEventListener("mousedown", startDragging);
canvas.addEventListener("mousemove", dragCircle);
canvas.addEventListener("mouseup", stopDragging);
}

function startDragging(event) {
  var rect = canvas.getBoundingClientRect();
  var mouseX = event.clientX - rect.left;
  var mouseY = event.clientY - rect.top;

  circles.forEach(function(circle) {
    // Check if the mouse is inside the circle
    if (Math.pow(mouseX - circle.x, 2) + Math.pow(mouseY - circle.y, 2) <= Math.pow(circle.radius, 2)) {
      circle.offsetX = mouseX - circle.x;
      circle.offsetY = mouseY - circle.y;
      circle.isDragging = true;
    }
    
  });
  
}

function dragCircle(event) {
  circles.forEach(function(circle) {
    if (circle.isDragging) {
      var rect = canvas.getBoundingClientRect();
      circle.x = event.clientX - rect.left - circle.offsetX;
      circle.y = event.clientY - rect.top - circle.offsetY;
    }
  });
  clearCanvas();
  drawLine();
}

function stopDragging() {
  circles.forEach(function(circle) {
    circle.isDragging = false;
  });
}

function animate() {
  clearCanvas();
// Calculate the position of variCharge based on variChargeDistance from fixChargeCenter
  var angleInRadians = variChargeAngle * (Math.PI / 180);
  var variChargeX = fixChargeCenter.x + variChargeDistance * Math.cos(angleInRadians);
  var variChargeY = fixChargeCenter.y + variChargeDistance * Math.sin(angleInRadians);
  drawCircle({x: variChargeX, y: variChargeY, radius: variChargeRadius, color: variChargeColor});
  drawForceArrow (circles[1]);
  size = sizeCalc();

  // Update the angle to be incremented by the speed
  variChargeSpeed = speedcalc(variChargeDistance);
  variChargeAngle += variChargeSpeed;
  window.requestAnimationFrame(animate);

  document.getElementById("voltage").innerHTML = voltCalc() + " eV";
  document.getElementById("velocity").innerHTML = velocitycalc(variChargeDistance).toFixed(0) + " m/s";
  document.getElementById("force").innerHTML = forceCalc () + " N"
};

animate();


function VoltSave () {
  var VoltRes = document.getElementById("voltage").innerText;
  storeVoltData(VoltRes);
 };

function VoltRadSave(){
  var purpCirclX = purpCircleX(circles[0]);
  var purpCirclY = purpCircleY(circles[0]);
  var radCalcV = (Math.sqrt(Math.pow(((canvas.width * 3 / 5) - purpCirclX), 2) + Math.pow(((canvas.height / 2) - purpCirclY), 2)));
  storeVoltaRadData(Math.round(radCalcV));
}

function VelocitySave () {
  var VelRes = velocitycalc(variChargeDistance);
  storeVelocityData(VelRes);
};

function VelocityRadSave () {
  var Vrad = variChargeDistance
  storeVelocityRadData(Vrad)
}


function StringtoNum(number) {
  number = number.replace(" N", '')
  snumber = number.split("e");
  right = parseInt(snumber[1])
  right = Math.pow(10, right)
  fnumber = parseFloat(snumber[0]) * right
  console.log("SN " + snumber)
  console.log("FN " + fnumber)
  return fnumber;
}

function ForceSave () {
 Force = document.getElementById("force").innerText
 ForceRes = StringtoNum(Force)
 console.log(ForceRes)
  storeForceData (ForceRes);
  };


function ForceRadSave (){
  var blackCirclX = blackCircleX(circles[1]);
  var blackCirclY = blackCircleY(circles[1]);
  var radCalcF = (Math.sqrt(Math.pow(((canvas.width * 3 / 5) - blackCirclX), 2) + Math.pow(((canvas.height / 2) - blackCirclY), 2)));
  storeForceRadData(Math.round(radCalcF));
}

let VoltData = []; // sorted
function storeVoltData (value) {
  if (circles[0].x >= (canvas.width / 4)) {
  VoltData.push(value);
  backwardsInsertionSort(VoltData)
  console.log(VoltData)
  }
  
};

let VoltRadData = []; // sorted
function storeVoltaRadData (value) {
  VoltRadData.push(value);
  insertionSort(VoltRadData);
  console.log(VoltRadData);
};

let VelocityData = []; // sorted
function storeVelocityData (value) {
  VelocityData.push(value);
  backwardsInsertionSort(VelocityData);
  console.log(VelocityData);
};

let VelocityRadData = []; // sorted
function storeVelocityRadData (value) {
  VelocityRadData.push(value);
  insertionSort(VelocityRadData);
  console.log(VelocityRadData);
};


let ForceData = []; // sorted
function storeForceData (value) {
  if (circles[1].x > canvas.width / 4) {
  ForceData.push(value);
  backwardsInsertionSort(ForceData)
  console.log(ForceData);
  }
};

let ForceRadData = []; // sorted
function storeForceRadData (value) {
  ForceRadData.push(value);
  insertionSort(ForceRadData);
  console.log(ForceRadData);
};


function showDataVolt(){
  var VoltdataArray = VoltData
  var VoltRadDataArray = VoltRadData
  var datatable = 
  '<html><head><title>Voltdata</title></head><body><table border = "2"><tr><td>Radius (nM)</td><td>Volts</tr>'
  
  for(var i = 0; i < VoltdataArray.length; i++ ){
    datatable = datatable + '<td>' + VoltRadDataArray[i] + '<td>' + VoltdataArray[i] 
  
    datatable = datatable + '</tr>'
  }

  datatable = datatable + '</table></body></html>';
  var newWindow = window.open('', 'Msg.Window', "width = 2000, height = 1000")
  newWindow.document.write(datatable)
}

function showDataVelocity(){
  var VelocityRadDataArray = VelocityRadData 
  var VelocitydataArray = VelocityData
  var datatable = '<html><head><title>Velocitydata</title></head><body><table border = "2"><td>Radius (nM)</td><td>Velocity</tr>'
  for(var i = 0; i < VelocitydataArray.length; i++ ){
    datatable = datatable + '<td>' + VelocityRadDataArray[i] + '<td>' + VelocitydataArray[i].toFixed(0) 
  
    datatable = datatable + '</tr>'
  }

  datatable = datatable + '</table></body></html>';
  var newWindow = window.open('', 'Msg.Window', "width = 2000, height = 1000")
  newWindow.document.write(datatable)
}

function showDataForce(){
  ForceRadDataArray = ForceRadData
  var ForceDataArray = ForceData
  var datatable = 
  '<html><head><title>Voltdata</title></head><body><table border = "2"><tr><td>Radius (nM)</td><td>Force</tr>'
  
  for(var i = 0; i < ForceDataArray.length; i++ ){
    datatable = datatable + '<td>' + ForceRadDataArray[i].toPrecision(4) + '<td>' + ForceDataArray[i].toPrecision(4) + "N"
  
    datatable = datatable + '</tr>'
  }

  datatable = datatable + '</table></body></html>';
  var newWindow = window.open('', 'Msg.Window', "width = 2000, height = 1000")
  newWindow.document.write(datatable)
}

function insertionSort (inputArr) {
  let n = inputArr.length;
    for(let i = 1; i < n; i++ ) {
      let current = inputArr[i];
      let j = i - 1
      while((j > -1 ) && (current < inputArr[j])) {
        inputArr[j + 1] = inputArr[j];
        j--;
      }
      inputArr[j + 1] = current
    }
    return inputArr;
}

function backwardsInsertionSort (inputArr) {
  let n = inputArr.length;
  for(let i = 1; i < n; i++ ) {
    let current = inputArr[i];
    let j = i - 1
    while((j > -1 ) && (current > inputArr[j])) {
      inputArr[j + 1] = inputArr[j];
      j--;
    }
    inputArr[j + 1] = current
  }
  return inputArr;
}

