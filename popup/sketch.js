console.log("popup started");

let countdown = document.getElementById("countdown");

let startbutton = document.getElementById("button");
let input = document.getElementById("inputfield");
let resetbutton=document.getElementById("reset");
let pausebutton = document.getElementById("pause");
let resumebutton = document.getElementById("resume");

let urlbutton=document.getElementById("urlblock");
let Unurlbutton=document.getElementById("Unurlblock");
let inputUrl=document.getElementById('inputurl');

let intervalId;


display();  /////   display call for to-do-lists


if(JSON.parse(localStorage.getItem("Alarm"))!=null){
    document.getElementById("AlarmTime").innerHTML=`Alarm set @ -${parseInt((JSON.parse(localStorage.getItem('Alarm'))[0]))} : ${parseInt((JSON.parse(localStorage.getItem('Alarm'))[1]))} `; 
}else{
    document.getElementById("AlarmTime").innerHTML="No Alarms SET"; 
}










//focus timer
let focusTime=document.getElementById("focusTime");
let focusCycles=document.getElementById("focusCycles");
let breakTime=document.getElementById("breakTime");
let focuscount=document.getElementById("focuscount");

chrome.runtime.sendMessage({ cmd: 'GETTIME' });

let intervalid;



if(parseInt(JSON.parse(localStorage.getItem('fCycles')))>0){
        
    console.log("false start");
    remainingCycles=JSON.parse(localStorage.getItem('fCycles'));
    
            
    counterfunc();  
    
    

}

document.getElementById("Addfocus").addEventListener('click',startFocus);

document.getElementById("clearStorage").addEventListener('click',clearstorage);

function clearstorage(){
    localStorage.removeItem("fCycles");
    localStorage.removeItem("fTime");
    localStorage.removeItem("fBreak");
    localStorage.removeItem("starttime");

    clearInterval(intervalid);
    focuscount.innerHTML="00:00";
    chrome.runtime.sendMessage({cmd:'UNBLOCK'});

    
}


function startFocus(){
    
        console.log("true start");
        localStorage.setItem("fCycles",JSON.stringify(focusCycles.value));
        localStorage.setItem("fTime",JSON.stringify(focusTime.value));
        localStorage.setItem("fBreak",JSON.stringify(breakTime.value));
        localStorage.setItem("starttime",JSON.stringify(Date.now()));

        counterfunc();
        
          

   
}

function counterfunc(){
    let fCycles=parseInt(JSON.parse(localStorage.getItem('fCycles')));
    let fTime=parseInt(JSON.parse(localStorage.getItem('fTime')));
    let fBreak=parseInt(JSON.parse(localStorage.getItem('fBreak')));
    let starttime=JSON.parse(localStorage.getItem('starttime'));

    
    console.log(starttime);
    console.log(fTime);
    console.log(fCycles);
    console.log(fBreak);

    let Time=((fBreak+fTime)*60) - ((Date.now()-starttime)/1000);
    
    console.log("Strt time in sec -",Time); 
    if(Time>0){
        intervalid=setInterval(timer,1000);

    }
    

    function timer(){

        let min;
        let sec;
        
        if (Time > 0) {
            min = Math.floor(Time / 60);
            sec = Math.floor(Time % 60);
            
        } else {
            min = 0;
            sec = 0;            
            clearInterval(intervalid);

            if(fCycles>1){
                console.log("timer called once agaian in POP UP");
                
                counterfunc();
            }
        }
        if (sec < 10) sec = '0' + sec;

        if(min<fBreak){
            
            focuscount.innerHTML = `${min} : ${sec}`;
            
        }else{

                    
            focuscount.innerHTML = `${min-fBreak} : ${sec}`;            
            

        }    

        Time--;

    }  


}

////ALARM

let minutes=document.getElementById("minutes");
let hours=document.getElementById("hours");

document.getElementById("setalarm").addEventListener('click',addAlarm);
document.getElementById("deletealarm").addEventListener('click',deleteAlarm);




function addAlarm(){
    document.getElementById("AlarmTime").innerHTML=`Alarm set @ -${hours.value} : ${minutes.value} `;    
    console.log("ALarm added");
    let timE=[`${hours.value}`,`${minutes.value}`];    
    localStorage.setItem('Alarm',JSON.stringify(timE));
    chrome.runtime.sendMessage({cmd:'ALARM'});
    
}
function deleteAlarm(){
    localStorage.removeItem('Alarm');
}




///// BLOCK List
urlbutton.addEventListener('click',blockurl);
Unurlbutton.addEventListener('click',unblockurl);


startbutton.addEventListener('click', startBtn);
pausebutton.addEventListener('click', pauseBtn);
resumebutton.addEventListener('click', resumeBtn);
resetbutton.addEventListener('click',resetBtn);

function blockurl(){
    console.log("url blocked");
    console.log(inputUrl.value);
    chrome.runtime.sendMessage({cmd:'BLOCK',Url:inputUrl.value});
}
function unblockurl(){
    console.log("url UNblocked");    
    chrome.runtime.sendMessage({cmd:'UNBLOCK'});
}





// Request for TIMER & BLOCK list
chrome.runtime.sendMessage({ cmd: 'GET' }, receivedResponse);

function receivedResponse(response) {
    if (response.duration) {//changed new
        counter(response.timee, response.duration);
    }
}



////  TIMER 


function resetBtn(){
    clearInterval(intervalId);
    let countdown = document.getElementById("countdown");
    countdown.innerHTML="00:00";

}


function startBtn() {
    console.log("timer started");    
    chrome.runtime.sendMessage({ cmd: 'START', timee: Date.now(), duration: input.value });
    counter(Date.now(), input.value);
    
        

}

function pauseBtn() {
    console.log("paused");
    chrome.runtime.sendMessage({ cmd: 'GET' }, receivedResponse);
    let start_time;
    let duration;

    function receivedResponse(response) {
        let start_time = new Date(response.timee);
        let duration = response.duration;

        chrome.runtime.sendMessage({ cmd: 'START', timee: start_time.getTime(),duration:duration, pause: Date.now() });
        clearInterval(intervalId);
        
    }
   

    

}
function resumeBtn() {
    console.log("resume");
    chrome.runtime.sendMessage({ cmd: 'GET' }, receivedResponse);
    let start_time;
    let duration;
    let pause_time;

    function receivedResponse(response) {
        let start_time = new Date(response.timee);
        let duration = response.duration;
        let pause_time = new Date(response.pause);
        console.log(Date.now());
        counter((start_time.getTime() + Date.now() - pause_time.getTime()), duration);
        
        
    }
    

}


function counter(StartTime, duration) {
    
    let time = (duration * 60000) - (Date.now() - StartTime);
    time=(time/1000);
    
   
    intervalId = setInterval(timer, 1000);
    

    function timer() {
        let min;
        let sec;
        
        if (time > 0) {
            min = Math.floor(time / 60);
            sec = Math.floor(time % 60);
            //if(time==0) chrome.runtime.sendMessage({cmd:"ALERT"}); // new
        } else {
            min = 0;
            sec = 0;            
            clearInterval(intervalId);
        }
        console.log("timer Running");

        if (sec < 10) sec = '0' + sec;

        countdown.innerHTML = `${min} : ${sec}`;
        time--;

    }

      

}



/////  TO-DO LIST (used local storage)


let todoinput=document.getElementById('inputToDo');

let addBtn=document.getElementById('inputToDoBtn');
addBtn.addEventListener('click',additem);

let removeBtn=document.getElementById('removeToDo');
removeBtn.addEventListener('click',removeitem);


function additem(){
    let i=1;

    
    while(JSON.parse(localStorage.getItem(`${i}`))!=null){
        i++;
    }
    var itemArr=[];    

    itemArr.push(todoinput.value);
    localStorage.setItem(`${i}`,JSON.stringify(itemArr));

    display();

}



function removeitem(){
    let i=1;

    while (JSON.parse(localStorage.getItem(`${i}`)) != null){
        localStorage.removeItem(`${i}`);
        i++;
    }

    display();

   

}

function display(){
    let display=document.getElementById('displaylist');
    let i=1;

    display.innerHTML="";    

    while (JSON.parse(localStorage.getItem(`${i}`)) != null) {
        let itemvalue=JSON.parse(localStorage.getItem(`${i}`));

        let para = document.createElement('p');
        para.innerHTML = `${itemvalue}<button id="${i}" class="btn btn-outline-secondary btn-sm" style="margin-left:10px;">x</button>`;

        display.appendChild(para);
        i++;
        para.addEventListener('click',()=>{para.style.textDecoration="line-through";});
    }

      

   
}
const wrapper=document.getElementById("displaylist");

wrapper.addEventListener('click', (event) => {
    const isButton = event.target.nodeName === 'BUTTON';
    if (!isButton) {
        return;
    };

    console.log("buttonClicked")
    removespecEle(event.target.id);
});

function removespecEle(i) {
    console.log("ele removed");
    localStorage.removeItem(`${i}`);
    console.log(i);
    let j=parseInt(i);
    j++;
    console.log(j);
    
    while(JSON.parse(localStorage.getItem(`${j}`)) != null){
        let ele=JSON.parse(localStorage.getItem(`${j}`));
        console.log("here");

        localStorage.setItem(`${j-1}`,JSON.stringify(ele));

        j++;

    }
    localStorage.removeItem(`${j-1}`);

    display();
}




////toggle bar


document.getElementById("bA").addEventListener('click',timeonly);
document.getElementById("bB").addEventListener('click',blocklistonly);
document.getElementById("bC").addEventListener('click',todoonly);
document.getElementById("bD").addEventListener('click',focusonly);
document.getElementById("bE").addEventListener('click',alarmonly);

function focusonly(){
    if(document.getElementById("D").style.display=="block"){
        document.getElementById("D").style.display="none";
    }else{
        document.getElementById("D").style.display="block";
    }
    
    document.getElementById("B").style.display="none";
    document.getElementById("C").style.display="none";
    document.getElementById("A").style.display="none";
    document.getElementById("E").style.display="none";


}

function timeonly(){
    if(document.getElementById("A").style.display=="block"){
        document.getElementById("A").style.display="none";
    }else{
        document.getElementById("A").style.display="block";
    }   
    
    document.getElementById("B").style.display="none";
    document.getElementById("C").style.display="none";
    document.getElementById("D").style.display="none";
    document.getElementById("E").style.display="none";


}

function blocklistonly(){

    if(document.getElementById("B").style.display=="block"){
        document.getElementById("B").style.display="none";
    }else{
        document.getElementById("B").style.display="block";
    }
    
    document.getElementById("A").style.display="none";
    document.getElementById("C").style.display="none";
    document.getElementById("D").style.display="none";
    document.getElementById("E").style.display="none";
    

}

function todoonly(){
    if(document.getElementById("C").style.display=="block"){
        document.getElementById("C").style.display="none";
    }else{
        document.getElementById("C").style.display="block";
    }
    document.getElementById("B").style.display="none";
    document.getElementById("A").style.display="none";
    document.getElementById("D").style.display="none";
    document.getElementById("E").style.display="none";


}

function alarmonly(){
    if(document.getElementById("E").style.display=="block"){
        document.getElementById("E").style.display="none";
    }else{
        document.getElementById("E").style.display="block";
    }
    document.getElementById("B").style.display="none";
    document.getElementById("A").style.display="none";
    document.getElementById("D").style.display="none";
    document.getElementById("C").style.display="none";


}

