//https://www.youtube.com/watch?v=XGioNBHrFU4&list=PLYElE_rzEw_siuo-kkHh5h7Sk--6IPYNh&index=22
// 48:49

const canvas = document.querySelector("#canvas1");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];

let adjustX = 10;
let adjustY = 10;

// handle mouse
const mouse = {
    x : null,
    y : null,
    radius : 100
}

window.addEventListener("mousemove", function(event){
    mouse.x = event.x;
    mouse.y = event.y;
    //mouse.radius = 150;
    //console.log(mouse.x,mouse.y);
})

ctx.fillStyle = 'white';
ctx.font = '30px Verdana';
ctx.fillText('lipsum', 0, 40);
ctx.fillText('립숨', 0, 80);

//ctx.strokeStyle = 'white';
//ctx.strokeRect(0,0,100,100);

const textCoordinates = ctx.getImageData(0,0,500,500);

class Particle {
    constructor(x, y){
        this.x = x + 100;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density  = (Math.random() * 30) + 1;
    }
    draw(){
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    update(){
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if(distance < mouse.radius){
            // PUSH
            this.x -= directionX;
            this.y -= directionY;
            // VACCUM
            //this.x += forceDirectionX * 3;
            //this.y += forceDirectionY * 3;
            //this.size = 10;
        } else {
            //this.size = 3;
            if(this.x !== this.baseX){
                let dx = this.x - this.baseX;
                this.x -= dx/10;
            }
            if(this.y !== this.baseY){
                let dy = this.y - this.baseY;
                this.y -= dy/10;
            }
        }
    }
}
// Uint8ClampedArray
// console.log(textCoordinates.data)
function init(){
    particleArray = [];
    // Random Particles
    /*
    for (let i = 0; i < 1000; i++){
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        particleArray.push(new Particle(x,y));
    }
    */
   // Text 
   for (let y = 0, y2 = textCoordinates.height; y < y2; y++){
    for (let x = 0, x2 = textCoordinates.width; x < x2; x++){
        if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
            let positionX = x + adjustX;
            let positionY = y + adjustY;
            particleArray.push(new Particle(positionX * 5, positionY * 5));
        }
    }
   }
    //particleArray.push(new Particle(50, 50));
    //particleArray.push(new Particle(80, 50));
}
init();
console.log(particleArray);

function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    for(let i = 0; i < particleArray.length; i++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    connect();
    requestAnimationFrame(animate);
}
animate();

function connect(){
    let opacityValue = 1;
    for(let a = 0; a < particleArray.length; a++){
        for(let b = a; b < particleArray.length; b++){
            //let dx = mouse.x - this.x;
            //let dy = mouse.y - this.y;
            //let distance = Math.sqrt(dx * dx + dy * dy);
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 20){
                opacityValue = 1 - (distance/20);
                ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particleArray[a].x, particleArray[a].y);
                ctx.lineTo(particleArray[b].x, particleArray[b].y);
                ctx.stroke();
            }
        }
    }
}