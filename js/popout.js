const topics = [["100", "26", "33", "83", "16", "2", "84", "1", "32", "13", "82", "17", "57", "108", "12", "85"], ["Bot_API", "Technical Support", "Accouns (Windows)", "Problem", "Aplication Issue", "Problem", "Problem", "Problem", "General Request", "Hardware Failure", "Problem", "Miscellaneous", "Problem", "Problem", "Problem", "VPN"]];
const values = [["210", "364", "212", "213", "211", "28", "31", "21", "30", "25"], ["Internal Issue/Other", "Abuse", "Contingency / External", "Contingency / External", "Contingency / Internal", "Internal_Overdue", "Internet_supply_issue", "Lack_of_knowledge", "power_supply_issue", "Unanswered"]];
const status = [["3", "2"], ["Closed", "Resolved"]];

function httpGet(theUrl) {
    let xmlHttpReq = new XMLHttpRequest();
    xmlHttpReq.open("GET", theUrl, false);
    xmlHttpReq.send(null);
    return xmlHttpReq.responseText;
}

document.addEventListener('DOMContentLoaded', function () {
    constructor();
    document.getElementById("btn-listen").addEventListener("click", async () => {
        let ticket = document.getElementById('ticketEntry').value;
        let arrayTicket = [];
        const getTicketPageHTML = httpGet('https://osticketserver/scp/tickets.php?number=' + ticket);
        let position = getTicketPageHTML.search('name="id"');
        arrayTicket.push(getTicketPageHTML.substring(position + 17, position + 23));
        position = getTicketPageHTML.search('__CSRFToken__');
        arrayTicket.push(getTicketPageHTML.substring(position + 22, position + 62));
        arrayTicket.push(document.getElementById('help-topic').value);
        arrayTicket.push(document.getElementById('internal-close').value);
        !document.getElementById('start').value ? arrayTicket.push('108'):arrayTicket.push('26');
        arrayTicket.push(setTime(document.getElementById('start').value));
        arrayTicket.push(setTime(document.getElementById('end').value));
        arrayTicket.push(document.getElementById('coment').value);
        arrayTicket.push(document.getElementById('close-status').value);
        chrome.runtime.sendMessage(arrayTicket, () => console.log("Se mando mensaje para bk"));
    });
});

function setTime(time){
    let date = new Date();
    date.setHours(time.substring(0,2));
    date.setMinutes(time.substring(3,5));
    date.setSeconds('00');
    date.setMilliseconds('000');
    return date.toISOString();
}

//Create the form
function constructor() {
    //This is where are putting on the chat
    let section = document.getElementById('container');
    //This is what we put
    let fragment = document.createDocumentFragment();
    let articleChat = document.createElement("article");
    articleChat.setAttribute('id', 'nameChat');
    //form
    let form = document.createElement('form');
    //Temp input tu ticket
    let inputTicket = document.createElement('input');
    inputTicket.setAttribute('id', 'ticketEntry');
    form.appendChild(inputTicket);
    //Help ticket
    let helpTopic = document.createElement('select');
    helpTopic.setAttribute('id', 'help-topic');
    helpTopic.setAttribute('name', 'help-topic');
    for (let index = 0; index < topics[0].length; index++) {
        let option = document.createElement('option');
        option.setAttribute('value', topics[0][index]);
        option.textContent = topics[1][index];
        helpTopic.appendChild(option);
    }
    form.appendChild(helpTopic);
    //Intenal-Close    
    let close = document.createElement('select');
    close.setAttribute('id', 'internal-close');
    close.setAttribute('name', 'internal-close');
    for (let index = 0; index < values[0].length; index++) {
        let option = document.createElement('option');
        option.setAttribute('value', values[0][index]);
        option.textContent = values[1][index];
        close.appendChild(option);
    }
    form.appendChild(close);
    //TIME EXCEPCTIONS
    let exception = ['start', 'end'];
    for (let index = 0; index < 2; index++) {
        let timers = document.createElement('input');
        timers.setAttribute('type', 'time');
        timers.setAttribute('id', exception[index]);
        timers.setAttribute('name', exception[index]);
        form.appendChild(timers);
    }
    //Coments
    let coment = document.createElement('textarea');
    coment.setAttribute('id', 'coment');
    coment.setAttribute('name', 'coment');
    form.appendChild(coment);
    //finish close
    let closeStatus = document.createElement('select');
    closeStatus.setAttribute('id', 'close-status');
    closeStatus.setAttribute('name', 'close-status');
    for (let index = 0; index < status[0].length; index++) {
        let option = document.createElement('option');
        option.setAttribute('value', status[0][index]);
        option.textContent = status[1][index];
        closeStatus.appendChild(option);
    }
    form.appendChild(closeStatus);
    //Send button
    let btn = document.createElement('button');
    btn.setAttribute('id', 'btn-listen');
    btn.setAttribute('type', 'button');
    btn.textContent = "Send";
    form.appendChild(btn);
    //hr
    let hr2 = document.createElement('hr');
    form.appendChild(hr2);
    articleChat.appendChild(form);
    //Set elements in the DOM
    fragment.appendChild(articleChat);
    section.appendChild(fragment);
}

function gmtToUtc(gmt) {
    let [h1, m1] = gmt.split(':')
    h1 = h1 + 5;
    if (h1 > 23) {
        h1 = h1 - 24;

    }
    let utc = h1 + ":" + m1;
    return utc;
}