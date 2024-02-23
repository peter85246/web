// 切换内容展开与否的函数，同时防止事件冒泡
function toggleContent(event, element) {
  let content = element.nextElementSibling;
  let arrow = element.querySelector(".arrow");

  if (content) {
    if (content.style.display === "block") {
      content.style.display = "none";
      if (arrow) {
        arrow.style.transform = "rotate(0deg)";
        arrow.classList.remove("down");
      }
      // 当收起时，也收起所有子项
      let subItems = content.querySelectorAll(".collapsible");
      subItems.forEach(function (subItem) {
        let subContent = subItem.nextElementSibling;
        if (subContent) {
          subContent.style.display = "none";
          let subArrow = subItem.querySelector(".arrow");
          if (subArrow) {
            subArrow.style.transform = "rotate(0deg)";
            subArrow.classList.remove("down");
          }
        }
      });
    } else {
      content.style.display = "block";
      if (arrow) {
        arrow.style.transform = "rotate(90deg)";
        arrow.classList.add("down");
      }
    }
  }

  event.stopPropagation(); // 防止事件冒泡
}

// 移除所有 final-item 的 active 类
function removeActiveClass() {
  document.querySelectorAll(".final-item.active").forEach(function (item) {
    item.classList.remove("active");
    item.style.color = ""; // 重置文本颜色为空，以使用默认颜色
    item.style.backgroundColor = ""; // 重置背景颜色为空，以使用默认颜色
  });
}

// 点击 final-item 时保持 hover 效果
function addClickToMaintainHoverEffect() {
  let finalItems = document.querySelectorAll(".content-alarm .final-item");

  finalItems.forEach(function (item) {
    item.addEventListener("click", function (event) {
      removeActiveClass();
      this.classList.add("active");
      this.style.color = "#252525";
      this.style.backgroundColor = "#ffffff";

      // 更新 btn-new 的文本及颜色为当前点击的 final-item 的文本及指定颜色
      updateBtnNewTextAndColor(this.textContent, "#266df7");

      updateCentralNodeTextAndColor(this.textContent);

      // 获取当前点击的 final-item 的父级菜单项的文本
      var parentMenuText = this.closest(".sub-menu-item")
        .querySelector(".collapsible")
        .textContent.trim();

      // 移除箭頭符号并加上 "系列" 字样
      var newText = parentMenuText.replace(">", "").trim() + "系列";

      // 更新页面上方的 <h2> 标签
      updateH2Text(newText); // 使用处理后的 newText

      event.stopPropagation(); // 防止事件冒泡到 collapsible
    });
  });
}

// 更新 btn-new 文本及颜色的函数
function updateBtnNewTextAndColor(text, color) {
  var btnNew = document.querySelector(".btn-new");
  if (btnNew) {
    btnNew.textContent = text;
    btnNew.style.color = color; // 设置文本颜色
  }
}

// 更新 central-node 內 span 的文本及顏色的函數
function updateCentralNodeTextAndColor(text, color) {
  // 選擇 central-node 內的 span 元素
  var centralNodeSpan = document.querySelector(".node.central-node span");

  if (centralNodeSpan) {
    centralNodeSpan.textContent = text; // 設置文本
    centralNodeSpan.style.color = color; // 設置文本顏色
  }
}

// 更新 btn-new 文本的函数
function updateBtnNewText(text) {
  var btnNew = document.querySelector(".btn-new");
  if (btnNew) {
    btnNew.textContent = text;
  }
}

// 页面加载时初始化
window.addEventListener("DOMContentLoaded", function () {
  hideOriginalMenuItems(); // 隱藏原有的菜單項目

  // 其他初始化函數...
  initializeCollapsibleItems(); // 初始化可折叠项
  loadSavedDataAndUpdateList(); // 加载保存的数据并更新列表
  addClickToMaintainHoverEffect(); // 为 final-items 添加点击事件
  bindModalEvents(); // 绑定模态框相关的事件
  addClickToUpdateTitle(); // 添加点击事件来更新标题
});

// 隱藏原有的菜單項目
function hideOriginalMenuItems() {
  var originalItems = document.querySelectorAll(".menu-item-alarm");
  originalItems.forEach(function (item) {
    item.style.display = "none"; // 隱藏這些元素
  });
}

// 添加点击事件来更新标题的函数
function addClickToUpdateTitle() {
  document.querySelectorAll(".final-item").forEach(function (item) {
    item.addEventListener("click", function () {
      var parentMenuText =
        this.closest(
          ".sub-menu-item"
        ).previousElementSibling.textContent.trim();
      updateTitle(parentMenuText);
    });
  });
}

// 更新 <h2> 標籤的文本
function updateH2Text(text) {
  var h2Element = document.getElementById("title-alarm");
  if (h2Element) {
    h2Element.textContent = text; // 將 <h2> 標籤的文本設定為提供的文本
  }
}

// 更新最后一个 final-item 元素的点击功能
function navigateLastFinalItem() {
  var menuContainer = document.querySelector(".menu");
  if (menuContainer) {
    var finalItems = menuContainer.querySelectorAll(".final-item");
    var lastFinalItem = finalItems[finalItems.length - 1]; // 获取最后一个 final-item 元素

    if (lastFinalItem) {
      // 为最后一个 final-item 添加点击事件
      lastFinalItem.addEventListener("click", function () {
        // 此处添加导航到 addNewMachine.html 的代码
        window.location.href = "./addNewMachine.html"; // 替换为正确的 URL
      });
    }
  }
}

// 初始化可折叠项
function initializeCollapsibleItems() {
  var allCollapsibles = document.querySelectorAll(".collapsible");
  allCollapsibles.forEach(function (collapsible) {
    collapsible.nextElementSibling.style.display = "none"; // 设置所有项为收起状态
  });
  addClickToMaintainHoverEffect(); // 添加点击保持 hover 效果的功能
}

// 创建并添加新的列表项到左侧菜单的函数
function createAndAddNewListItem(machineCategory, modelSeries, machineModel) {
  var menuContainer = document.querySelector(".menu");
  if (menuContainer) {
    var newListItem = document.createElement("div");
    newListItem.classList.add("menu-item-alarm");
    newListItem.innerHTML = `
      <div class="collapsible">
        <span class="arrow"></span>${machineCategory}
      </div>
      <div class="content-alarm" style="display: none;">
        <div class="sub-menu-item">
          <div class="collapsible">
            <span class="arrow"></span>${modelSeries}
          </div>
          <div class="content-alarm" style="display: none;">
            <div class="final-item"><span class="dot"></span>${machineModel}</div>
          </div>
        </div>
      </div>`;

    // 將新項目添加到菜單容器的開頭
    menuContainer.prepend(newListItem);
    initializeCollapsibleItems(); // 重新初始化可折叠项

    var collapsibles = newListItem.querySelectorAll(".collapsible");
    collapsibles.forEach(function (collapsible) {
      collapsible.addEventListener("click", function (event) {
        toggleContent(event, collapsible);
      });
    });

    // 添加点击事件以导航到 addNewMachine.html
    var finalItem = newListItem.querySelector(".final-item");
    if (finalItem) {
      finalItem.addEventListener("click", function () {
        window.location.href = "./addNewMachine.html";
      });
    }

    menuContainer.appendChild(newListItem);
  }
}

// addNewMachine.html 页面加载时，更新显示的信息
window.addEventListener("DOMContentLoaded", function () {
  var menuItems = document.querySelectorAll(".final-item");

  // 获取 .custom-datalist-alarm 列表
  var dataList = document.querySelector(".custom-datalist-alarm");

  // 遍历已存在的菜单项并将它们添加到列表中
  menuItems.forEach(function (menuItem) {
    // 获取菜单项的文本内容
    var itemText = menuItem.textContent.trim();

    // 创建一个新的 li 元素
    var listItem = document.createElement("li");
    listItem.textContent = itemText;

    // 将新的 li 元素添加到 .custom-datalist-alarm 列表中
    dataList.appendChild(listItem);
  });

  // 獲取下拉箭頭元素和下拉列表
  var dropdownArrowAlarm = document.querySelector(".drop-down-arrow-alarm");
  var dropdownList = document.querySelector(".custom-datalist-alarm");

  // 添加点击事件监听器
  dropdownArrowAlarm.addEventListener("click", function () {
    // 切換下拉列表的顯示狀態
    dropdownList.classList.toggle("active");
  });

  // 獲取所有的li項目 -- ( 替換標題項目 )
  var liItems = document.querySelectorAll(".custom-datalist-alarm li");

  // 獲取<a>元素
  var addButton = document.querySelector(".button.btn-new");

  // 為每個li項目添加點選事件監聽器
  liItems.forEach(function (li) {
    li.addEventListener("click", function () {
      // 獲取點選的li項目的文本內容
      var selectedItemText = this.textContent;

      // 更新<a>元素的內容
      addButton.textContent = selectedItemText;

      // 添加/移除樣式類別以更改文本顏色
      addButton.classList.add("replaced-content");
    });
  });

  // 獲取所有的 final-item 元素
  var finalItems = document.querySelectorAll(".final-item");

  // 為每個 final-item 添加點擊事件
  finalItems.forEach(function (item) {
    item.addEventListener("click", function () {
      // 獲取當前 final-item 的父級菜單文字
      var parentMenuItem = item
        .closest(".content-alarm")
        .previousElementSibling.textContent.trim();

      // 更新頁面上方的標題
      updatePageTitle(parentMenuItem);
    });
  });

  // 更新頁面標題的函數
  function updatePageTitle(newTitle) {
    // 獲取頁面上方的標題元素
    var pageTitleElement = document.querySelector(".header h2");

    // 如果找到標題元素，則更新其內容
    if (pageTitleElement) {
      pageTitleElement.textContent = newTitle;
    }
  }

  var selectedMachineModel = localStorage.getItem("selectedMachineModel");
  if (selectedMachineModel) {
    // 更新页面上的内容
    // 例如：设置某个元素的文本为 selectedMachineModel
  }

  // 从 localStorage 获取保存的文本
  var displayText = localStorage.getItem("displayTextOnAddNewMachine");

  if (displayText) {
    // 更新页面上的 btn-new 元素
    var btnNew = document.querySelector(".btn-new");
    if (btnNew) {
      btnNew.textContent = displayText;
    }
  }

  // 清除 localStorage 中的 displayTextOnAddNewMachine
  localStorage.removeItem("displayTextOnAddNewMachine");

  // 為所有的 final-item 添加點擊事件監聽器
  document.querySelectorAll(".final-item").forEach(function (item) {
    item.addEventListener("click", function () {
      // 获取 final-item 的文本
      var finalItemText = this.textContent.trim();

      // 将文本存储到 localStorage
      localStorage.setItem("selectedFinalItemText", finalItemText);

      // 獲取父級菜單項目的名稱
      var parentMenuText = this.closest(".content-alarm")
        .previousElementSibling.querySelector(".arrow")
        .textContent.trim();
      // 更新 title-area 中的 <h2> 標籤
      updateTitle(parentMenuText);
    });
  });
});

// 選擇元素
var alarmBox = document.getElementById("alarm-mindMap");

// 為元素添加點擊事件監聽器
alarmBox.addEventListener("click", function () {
  // 導航到 mindMap.html
  window.location.href = "mindMap.html";
});

document
  .querySelector(".content-box-right-alarm")
  .addEventListener("click", function () {
    // 获取 content-box-right-alarm 内的 span 文本
    var spanText = this.querySelector("span").textContent;
    // 获取当前页面 h2 标签的文本
    var h2Text = document.querySelector("h2").textContent;

    // 获取 collapsible 内的文本，并排除不需要的字符
    var collapsibleElement = document.querySelector(".collapsible");
    var arrowElement = collapsibleElement.querySelector(".arrow");
    var collapsibleText = collapsibleElement.textContent.trim();

    // 如果存在箭头元素，从文本中移除箭头的文本
    if (arrowElement) {
      var arrowText = arrowElement.textContent.trim();
      collapsibleText = collapsibleText.replace(arrowText, "").trim();
    }

    // 将文本存储到 localStorage
    localStorage.setItem("selectedSpanText", spanText);
    localStorage.setItem("selectedCollapsibleText", collapsibleText);
    localStorage.setItem("h2TextForMindMap", h2Text);

    // 跳转到 mindMap.html
    window.location.href = "mindMap.html";
  });

/* // 清空列表項目 test
function clearListAndLocalStorage() {
  // 清空 localStorage 中与列表相关的数据
  localStorage.removeItem("newMachines");

  // 获取列表容器
  var menuContainer = document.querySelector(".menu");
  if (menuContainer) {
    // 清空列表容器中的所有子元素
    while (menuContainer.firstChild) {
      menuContainer.removeChild(menuContainer.firstChild);
    }
  }
}

// 直接调用函数来清空列表和 localStorage
clearListAndLocalStorage(); */
