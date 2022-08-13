chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  var data=request;
  sendResponse('ok');
  
  fetch("https://osticketserver/tickets/"+data[0]+"/field/numberfield/edit", {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
      "x-csrftoken": data[1],
      "x-requested-with": "XMLHttpRequest"
    },
    "referrer": "https://osticketserver/tickets.php?id="+data[0]+"",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "field="+data[3],
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  });

});
