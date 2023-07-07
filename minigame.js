let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let W = canvas.width;
let H = canvas.height;
let degrees = 0;
let new_degrees = 0;
let time = 0;
let color = "#ff0000";
let txtcolor = "#ffffff";
let bgcolor = "#404b58";
let bgcolor2 = "#41a491";
let bgcolor3 = "#00ff00";
let key_to_press;
let g_start, g_end;
let animation_loop;

let streak = 0;
let max_streak = 0;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function init(correct) {
    // Clear the canvas every time a chart is drawn
    ctx.clearRect(0,0,W,H);

    // Background 360 degree arc
    ctx.beginPath();
    ctx.strokeStyle = bgcolor;
    ctx.lineWidth = 10;
    ctx.arc(W / 2, H / 2, 100, 0, Math.PI * 2, false);
    ctx.stroke();

    // Green zone
    ctx.beginPath();
    ctx.strokeStyle = correct === true? bgcolor3 : bgcolor2;
    ctx.lineWidth = 20;
    ctx.arc(W / 2, H / 2, 100, g_start - 90 * Math.PI / 180, g_end - 90 * Math.PI / 180, false);
    ctx.stroke();

    // Angle in radians = angle in degrees * PI / 180
    let radians = degrees * Math.PI / 180;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 40;
    ctx.arc(W / 2, H / 2, 90, radians - 0.1 - 90 * Math.PI / 180, radians - 90 * Math.PI / 180, false);
    ctx.stroke();

    // Adding the key_to_press
    ctx.fillStyle = txtcolor;
    ctx.font = "100px sans-serif";
    let text_width = ctx.measureText(key_to_press).width;
    ctx.fillText(key_to_press, W / 2 - text_width / 2, H / 2 + 35);
}

key_to_press = getRandomInt(8, 16)

function draw() {
    if (typeof animation_loop !== undefined) clearInterval(animation_loop);

    document.querySelector('.stats .streak').innerHTML = streak;
    document.querySelector('.stats .max-streak').innerHTML = max_streak;

    g_start = getRandomInt(20,40) / 15;
    g_end = getRandomInt(3,5) / 15;
    g_end = g_start + g_end;

    degrees = 0;
    new_degrees = 360;

    time = getRandomInt(1, 3) * 8;

    animation_loop = setInterval(animate_to, time);
}

function animate_to() {
    if (degrees >= new_degrees) {
        document.querySelector('.text.status').innerHTML = 'Skipped!';
        console.log('Failed: timeout!');
        wrong();
        draw();
        return;
    }
    degrees+=2;
    init();
}

function correct(){
    document.querySelector('.stats').classList.remove('wrong');
    if(streak > max_streak){
        max_streak = streak;
    }
    streak++;
    key_to_press--;

    if (key_to_press === 0) {
        document.querySelector('.text.status').innerHTML = 'GALING MO NAMAN!';
        key_to_press = getRandomInt(8, 20);
    }

}

function wrong(){
    document.querySelector('.stats').classList.add('wrong');
    if(streak > max_streak){
        max_streak = streak;
    }
    streak = 0;

    key_to_press = getRandomInt(8, 15)
}

document.addEventListener("keydown", function(ev) {
    let key_pressed = ev.key;
    let valid_keys = ['e'];

    if (key_pressed === "e") {
        bgcolor3 = "#ff0000";
        if( key_pressed === "e" ){
            let d_start = (180 / Math.PI) * g_start;
            let d_end = (180 / Math.PI) * g_end;
            if( degrees < d_start ){
                document.querySelector('.text.status').innerHTML = 'Too soon!';
                wrong();
            }else if( degrees > d_end ){
                document.querySelector('.text.status').innerHTML = 'Too late!';
                wrong();
            }else{
                document.querySelector('.text.status').innerHTML = 'Success!';
                bgcolor3 = "#00ff00";
                correct();
            }
        } else {
            wrong();
        }
        init(true);
        clearInterval(animation_loop);
        setTimeout(function(){
            draw();
        }, 200);
    }
});

draw();