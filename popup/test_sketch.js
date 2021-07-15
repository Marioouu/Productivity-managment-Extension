let startbutton=document.getElementById("button");
let input=document.getElementById("inputfield");
let resetbutton=document.getElementById("reset");

let pausebutton=document.getElementById("pause");
let resumebutton=document.getElementById("resume");

let intervalId;


chrome.runtime.sendMessage({ cmd: 'GET' }, receivedResponse);

function receivedResponse(response){
    if(response.time){
        counter(response.time,response.duration);
    }
}

startbutton.addEventListener('click',startBtn);
pausebutton.addEventListener('click',pauseBtn);
resumebutton.addEventListener('click',resumeBtn);
resetbutton.addEventListener('click',resetBtn);

function resetBtn(){
    clearInterval(intervalId);
    let countdown = document.getElementById("countdown");
    countdown.innerHTML="00:00";

}


function startBtn(){
    chrome.runtime.sendMessage({ cmd: 'START', time: Date.now(), duration:input.value  });
    counter(Date.now(),input.value);
    
}

function pauseBtn(){
    chrome.runtime.sendMessage({ cmd: 'GET' }, receivedResponse);
    let start_time;
    let duration;

    function receivedResponse(response) {
        let start_time=new Date(response.time);
        let duration=response.duration;        
    }

    chrome.runtime.sendMessage({ cmd: 'START', time: start_time, pause:Date.now() });
    clearInterval(intervalId);
    

}

function resumeBtn(){
    chrome.runtime.sendMessage({ cmd: 'GET' }, receivedResponse);
    let start_time;
    let duration;

    function receivedResponse(response) {
        let start_time=new Date(response.time);
        let duration=response.duration;
        let pause_time=new Date(response.pause);
        
        counter(start_time+Date().now+pause_time,duration);
    }

}


function counter(StartTime,duration){
    //countDown logic
    let countdown = document.getElementById("countdown");


    let time = (duration * 60) - Math.floor(((Date.now() - StartTime) / 1000));

    intervalId=setInterval(timer, 1000);

    function timer() {
        let min;
        let sec;
        if(time>=0){
            min = Math.floor(time / 60);
            sec = (time % 60);
        }else{
            min = 0;
            sec = 0;
        }
        
        if (sec < 10) sec = '0' + sec;

        countdown.innerHTML = `${min} : ${sec}`;
        time--;

    }

}
