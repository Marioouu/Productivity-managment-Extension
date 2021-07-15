console.log("background-running");

let popupstart_time=0;//changed new
let popup_duration=0;
let popup_pause=0; //changednew

let url_flag=false;
let blocklist=[];

let todolist=[];




setInterval(checker,1000);


//for focus timer

function checker() {
    if ((parseInt(JSON.parse(localStorage.getItem(`fCycles`)))) > 0) {
        

        let fCycles = parseInt(JSON.parse(localStorage.getItem(`fCycles`)));
        let fBreak = parseInt(JSON.parse(localStorage.getItem(`fBreak`)));
        let fTime = parseInt(JSON.parse(localStorage.getItem(`fTime`)));
        let starttime = (JSON.parse(localStorage.getItem(`starttime`)));

        if ((((fBreak + fTime) * 60) - ((Date.now() - starttime) / 1000)) <= 0  &&  (((fBreak + fTime) * 60) - ((Date.now() - starttime) / 1000))>=-1 ) {
            if(fCycles>1) alert('Break Finished Back to Work');
            localStorage.setItem("fCycles", JSON.stringify(fCycles - 1));
            localStorage.setItem("starttime", JSON.stringify(Date.now()));
            StopBlocking();
        }


        if(((fTime*60)-((Date.now()-starttime)/1000))<=0  && ((fTime*60)-((Date.now()-starttime)/1000))>=-1){
            blocklist[0]=`*://*/*`;
            StartBlocking();
            alert('Take A Break');
        }

        

    }else if((parseInt(JSON.parse(localStorage.getItem(`fCycles`)))) <= 0){
        alert('Focus Time Ended');
        
        localStorage.removeItem("fCycles");
        localStorage.removeItem("fTime");
        localStorage.removeItem("fBreak");
        localStorage.removeItem("starttime");
        StopBlocking();
        
    }
}





chrome.runtime.onMessage.addListener(Requestprocess);

//for timer
function Requestprocess(request, sender, sendResponse) {
    if (request.cmd == 'START') {
        popupstart_time = new Date(request.timee);
        popup_duration = request.duration;
        popup_pause = new Date(request.pause)
        console.log(popup_duration);
        

    } else if (request.cmd == 'GET') {        
        sendResponse({ timee: popupstart_time.getTime(), duration: popup_duration, pause: popup_pause.getTime() });
    }





    //for url's blocker
    if (request.cmd == 'BLOCK') {
        url_flag = true;
        
        blocklist.push(`*://*.${request.Url}/*`); 
        console.log(blocklist); 
        StartBlocking();       

    } else if (request.cmd == 'UNBLOCK') {
        url_flag = false;
        blocklist=[];
        StopBlocking();
    }



    //for To-Do list
    if(request.cmd=='ADDtodo'){
        todolist.push(request.todo);

    }else if(request.cmd=='GETtodo'){
        sendResponse(todolist);
    }else if(request.cmd=='Removetodo'){
        
    }

    if(request.cmd=="ALERT"){
        console.log("ALERT req received");
        alert("Time is up");
        
    }///Alarm
    if(request.cmd=='ALARM'){
        console.log("alarm loded");
        let hrs=parseInt((JSON.parse(localStorage.getItem('Alarm'))[0]));
        let mins=parseInt((JSON.parse(localStorage.getItem('Alarm'))[1]));

        
        let x=new Date();
        let timeoutInMiliSec=(((hrs*3600)+(mins*60))-(((x.getHours())*3600)+(x.getMinutes())*60+(x.getSeconds())))*1000;
        console.log("time remainingt - ",timeoutInMiliSec);
        
        setTimeout(()=>{
            alert('ALARM !!!!');
            localStorage.removeItem('Alarm');
        },timeoutInMiliSec);
        
    }

}


function StartBlocking() {
    console.log("Blocking Started");
    console.log(blocklist);
    chrome.webRequest.onBeforeRequest.addListener(
        cancelFunc,
        { urls: blocklist },
        ['blocking']
    );
}

function StopBlocking(){
    console.log("blocking stopped");
    chrome.webRequest.onBeforeRequest.removeListener(cancelFunc);
}

const cancelFunc = () => {

    console.log("url Blocked");

    return {
        cancel: true

    }

};



