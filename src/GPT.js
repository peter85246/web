// 绑定发送按钮的点击事件
document.getElementById("send").addEventListener("click", function () {
  var inputText = document.getElementById("chat-input").value.trim();
  if (inputText) {
    document.querySelector(".user-question").textContent = inputText;
    // 这里可以添加与后端的交互逻辑
  }
});

// 中止按钮的功能实现
document.getElementById("cancel").addEventListener("click", function () {
  // 暂停GPT回应的生成，这需要后端支持，此处仅作为前端展示
  document.querySelector(".gpt-response").innerHTML += "<p>回應已中止...</p>";
});

// new chat按钮的功能实现
document.getElementById("new-chat").addEventListener("click", function () {
  // 刷新页面，开启新的聊天窗口
  window.location.reload();
});

// Clear按钮的功能实现
document.getElementById("clear").addEventListener("click", function () {
  // 清除左侧输入框的内容
  document.querySelector(".chat-input").value = "";
  // 清除右侧问题区域的内容
  document.querySelector(".user-question").textContent = "";
});

document
  .getElementById("linkToFirstPage")
  .addEventListener("click", function () {
    window.location.href = "./firstPage.html";
  });
