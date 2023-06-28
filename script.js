// load brand embassy script:
(function (i, s, o, r, g, v, a, m) {
  g = v ? g + "?v=" + v : g;
  i["BrandEmbassy"] = r;
  i[r] =
    i[r] ||
    function () {
      (i[r].q = i[r].q || []).push(arguments);
    };
  i[r].l = +new Date();
  a = s.createElement(o);
  m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g + "?" + Math.round(Date.now() / 1000 / 3600);
  m.parentNode.insertBefore(a, m);
})(
  window,
  document,
  "script",
  "brandembassy",
  "https://livechat-static-de-na1.niceincontact.com/4/chat.js"
);

// read cross-domain chat session id cookie:
var cookieName = "be_chat_session_id";
var restoredSessionId = getCookie(cookieName);

// restore chat session using existing chat session id:
if (restoredSessionId) {
  console.log("Restorable chat session id available: ", restoredSessionId);
  localStorage.setItem("_BECustomerId", restoredSessionId);
}

// read dynamically generated chat session id from localStorage and
// store it in a cross-domain shared cookie after plugin initialization:
onChatLoaded(function () {
  // BrandEmbassy script uses "_BECustomerId" key to identify the client and interact with it
  var chatSessionId = localStorage.getItem("_BECustomerId");
  var domain = document.domain.match(/[^\.]*\.[^.]*$/)[0];

  // set cross-domain cookie if it doesn't exist yet:
  if (!restoredSessionId) {
    setCookie(cookieName, chatSessionId, domain);
  }
});

// initialize chat plugin:
brandembassy("init", 2828, "chat_8bdf1ec0-0240-4273-af0f-29818ba7b637");

/* util section */

// chat initialization event util
function onChatLoaded(callback) {
  var mutationObserver = new MutationObserver(function (
    mutationsList,
    observer
  ) {
    for (var mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        for (var addedNode of Array.from(mutation.addedNodes)) {
          if (addedNode.id === "be-chat-container") {
            observer.disconnect();
            callback();
          }
        }
      }
    }
  });
  mutationObserver.observe(this.document.body, { childList: true });
}

// cookie utils
function setCookie(name, value, domain, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name + "=" + (value || "") + expires + "; path=/; domain=" + domain + ";";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}
