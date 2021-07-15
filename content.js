console.log("content-ready");


chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message,sender,sendResponse){
    console.log(message.txt);
    
    let para = document.getElementsByTagName('p');
    for (let i = 0; i < para.length; i++) {
        para[i].innerHTML = message.txt;
        para[i].style.textDecoration = "line-through";


    }
    return true;
    
    

}

