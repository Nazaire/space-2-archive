// /**
//  * Listens for the app launching, then creates the window.
//  *
//  * @see http://developer.chrome.com/apps/app.runtime.html
//  * @see http://developer.chrome.com/apps/app.window.html
//  */
// chrome.app.runtime.onLaunched.addListener(function(launchData) {
//   chrome.app.window.create(
//     'index.html',
//     {
//       id: 'mainWindow',
//       width: 800,
//       height: 600,
//       minWidth: 800,
//       minHeight: 600,
//       resizable: true,
//       frame: {
//         type: 'chrome',
//         color: '#465298'
//       }
//     }
//   );
// });

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//   if(message.action == "openURL") window.open(message.url);
// });