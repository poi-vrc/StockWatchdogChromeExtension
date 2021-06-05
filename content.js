chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.text === 'send-stockwatchdog-html') {
        sendResponse(document.all[0].outerHTML);
    }
});
chrome.runtime.sendMessage('ready-send-stockwatchdog-html');