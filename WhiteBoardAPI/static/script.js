let canvas = document.getElementById("board");
let ctx = canvas.getContext("2d");

// Set high quality drawing parameters
ctx.strokeStyle = "#1a3c68";
ctx.lineWidth = 3;
ctx.lineCap = "round";
ctx.lineJoin = "round";

let drawing = false;
let lines = [];

let headerHeight = 70;
let footerHeight = 70;

// Draw Header and Footer
function drawLayout() {
    ctx.save();

    // Draw Header
    ctx.fillStyle = "#0c2340";
    ctx.fillRect(0, 0, canvas.width, headerHeight);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SIT Nagpur Whiteboard", canvas.width / 2, headerHeight / 2);

    // Draw Footer
    ctx.fillStyle = "#0c2340";
    ctx.fillRect(0, canvas.height - footerHeight, canvas.width, footerHeight);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px 'Segoe UI', Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Thank You!", canvas.width / 2, canvas.height - footerHeight / 2);

    ctx.restore();
}

drawLayout();

canvas.addEventListener("mousedown", function(e){

    let x = e.offsetX;
    let y = e.offsetY;

    if(y < headerHeight){
        alert("You cannot edit this section!");
        return;
    }

    if(y > canvas.height - footerHeight){
        alert("You cannot edit this section!");
        return;
    }

    drawing = true;

    ctx.beginPath();
    ctx.moveTo(x, y);

    lines.push({
        type: "start",
        x: x,
        y: y
    });

});

canvas.addEventListener("mousemove", function(e){

    if(!drawing){
        return;
    }

    let x = e.offsetX;
    let y = e.offsetY;

    ctx.lineTo(x, y);
    ctx.stroke();

    lines.push({
        type: "draw",
        x: x,
        y: y
    });

});

canvas.addEventListener("mouseup", function(){

    drawing = false;

});

canvas.addEventListener("mouseleave", function(){

    drawing = false;

});

function saveBoard(){
    fetch("/save",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            lines:lines
        })
    })
    .then(response=>response.json())
    .then(data=>{
        alert("POST Request Successful: " + data.message);
    });
}

function loadBoard(){
    fetch("/load")
    .then(response=>response.json())
    .then(data=>{
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawLayout();
        lines = data.lines;
        ctx.beginPath();
        for(let i=0;i<lines.length;i++){
            if(lines[i].type=="start"){
                ctx.beginPath();
                ctx.moveTo(lines[i].x,lines[i].y);
            }
            else{
                ctx.lineTo(lines[i].x,lines[i].y);
                ctx.stroke();
            }
        }
        alert("GET Request Successful: Loaded drawing from server!");
    });
}

function clearBoard(){
    lines=[];
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawLayout();
    alert("Board cleared! (Saved data is still available — click Load to restore it)");
}