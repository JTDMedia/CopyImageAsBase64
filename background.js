chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "copyImageAsBase64",
    title: "Copy Image as Base64",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "copyImageAsBase64") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: convertImageToBase64,
      args: [info.srcUrl]
    });
  }
});

async function convertImageToBase64(imgUrl) {
  try {
    const res = await fetch(imgUrl);
    const blob = await res.blob();
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      navigator.clipboard.writeText(base64data).then(() => {
        alert("Base64 image copied to clipboard!");
      }).catch(err => {
        alert("Failed to copy: " + err);
      });
    };
    reader.readAsDataURL(blob);
  } catch (e) {
    alert("Error: " + e.message);
  }
}