// 绑定模态框相关的事件
function bindModalEvents() {
  document
    .getElementById("openModalBtn-machine")
    .addEventListener("click", function () {
      var machineInfos = document.querySelectorAll(".machine-Info");
      var modelSeries = machineInfos[1].value; // 获取“型號系列”
      var machineModel = document.querySelector(".input-machineModel").value; // 获取“機台型號”

      if (!modelSeries || !machineModel) {
        alert("所有欄位必須填寫完畢。");
        return;
      }

      localStorage.setItem("modelSeries", modelSeries);
      localStorage.setItem("machineModel", machineModel);

      window.location.href = "./addNewMachine.html";
    });
}

window.addEventListener("DOMContentLoaded", function () {
  var modelSeries = localStorage.getItem("modelSeries");
  var machineModel = localStorage.getItem("machineModel");

  var btnNew = document.querySelector(".button.btn-new");
  var centralNodeSpan = document.querySelector(".mindmap .central-node span");

  var displayElementSeries = document.querySelector("h2#title-alarm");
  if (displayElementSeries && modelSeries) {
    displayElementSeries.textContent = `${modelSeries}系列`;
  }

  var btnNew = document.querySelector(".button.btn-new");
  if (btnNew && machineModel) {
    btnNew.textContent = machineModel;
    btnNew.style.color = "#266df7";
  }

  if (machineModel) {
    if (btnNew) {
      btnNew.textContent = machineModel;
      btnNew.style.color = "#266df7";
    }
    if (centralNodeSpan) {
      centralNodeSpan.textContent = machineModel;
    }
  }

  // 在页面加载完成时添加事件监听器
  var numberInput = document.getElementById("number-input");
  numberInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      var isValidInput = checkInputRange(numberInput); // 获取输入是否有效的信息
      if (isValidInput) {
        showModal(); // 只在输入有效时显示模态框

        // 调用函数创建相应数量的分支字段
        createBranchFields(numberInput.value);
      }
    }
  });

  // 關閉模態框 + 灰色背景
  var closeModalBtn = document.getElementById("closeModalBtn");
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", function () {
      var modalOverlay = document.getElementById("modalOverlay-newMachine");
      var myModal = document.getElementById("myModal"); // 获取模态框元素的 ID
      if (modalOverlay && myModal) {
        modalOverlay.style.display = "none"; // 隐藏背景
        myModal.style.display = "none"; // 隐藏模态框
      }
    });
  }

  initializePopup(); // 初始化列表的隐藏状态
  updateMinusIcons(); // 调用函数以更新减号图标和它们的事件监听器
  bindSaveButton(); // 確保在每次進入編輯模式時重新綁定儲存按鈕
});

function createBranchFields(numberOfBranches) {
  var container = document.querySelector(".box-condition-alarm2"); // 获取模态框中的容器
  container.innerHTML = ""; // 清空容器内容

  // 根据输入的数字创建相应数量的分支项目字段
  for (var i = 1; i <= numberOfBranches; i++) {
    var formGroup = document.createElement("div");
    formGroup.className = "form-group-condition";

    // 创建标签
    var label = document.createElement("label");
    label.className = "red-star-branch";
    label.setAttribute("for", "invoice-number");
    label.textContent = "分支" + i + "：";

    // 创建第一个下拉选择框
    var customSelect1 = createCustomSelect(
      "維修類型",
      "custom-select-alarm1",
      "invoice-options-" + i + "-type"
    );

    // 创建第二个下拉选择框
    var customSelect2 = createCustomSelect(
      "維修項目",
      "custom-select-alarm2",
      "invoice-options-" + i + "-item"
    );

    // 将元素添加到 formGroup
    formGroup.appendChild(label);
    formGroup.appendChild(customSelect1);
    formGroup.appendChild(customSelect2);
    container.appendChild(formGroup);
  }
}

function createCustomSelect(placeholder, className, optionsId) {
  var customSelect = document.createElement("div");
  customSelect.className = className;

  var input = document.createElement("input");
  input.className = "fault-Info";
  input.name = "invoice-number";
  input.id = "invoice-number";
  input.placeholder = placeholder;

  var span = document.createElement("span");
  span.className = "drop-down-arrow";
  span.textContent = "▼";

  var ul = document.createElement("ul");
  ul.className = "custom-datalist";
  ul.id = optionsId;

  // 为示例，添加三个选项
  for (var i = 1; i <= 3; i++) {
    var li = document.createElement("li");
    li.setAttribute("data-value", "選項" + i);
    li.textContent = "選項" + i;
    ul.appendChild(li);
  }

  customSelect.appendChild(input);
  customSelect.appendChild(span);
  customSelect.appendChild(ul);

  return customSelect;
}

// 新定义的函数以显示模态框 + 背景
function showModal() {
  var modalOverlay = document.getElementById("modalOverlay-newMachine");
  var myModal = document.getElementById("myModal"); // 确保也获取模态框元素

  if (modalOverlay && myModal) {
    modalOverlay.style.display = "block"; // 显示背景
    myModal.style.display = "block"; // 显示模态框
  }
}

function togglePopup() {
  var popup = document.getElementById("number-popup");
  var numberInput = document.getElementById("number-input");
  var plusButton = document.getElementById("add-btn-new-right"); // 获取 "+" 按钮

  if (popup.style.display === "none") {
    popup.style.display = "block";
    numberInput.value = "1"; // 设置默认值为 1
    numberInput.focus(); // 自动聚焦到输入框
    plusButton.classList.add("popup-visible");
  } else {
    popup.style.display = "none";
    plusButton.classList.remove("popup-visible");
  }
}

function checkInputRange(inputElement) {
  var value = parseInt(inputElement.value, 10);
  if (!isNaN(value) && value >= 1 && value <= 15) {
    return true; // 输入有效，返回 true
  } else {
    alert("输入的数字必须在1到15之间。");
    inputElement.value = "1"; // 重置为默认值
    return false; // 输入无效，返回 false
  }
}

// 页面加载完成时调用此函数来初始化列表的隐藏状态
function initializePopup() {
  var popup = document.getElementById("number-popup");
  popup.style.display = "none"; // 确保列表初始不显示
}

/* -------------------- 創建分支模態框-按鈕 ----------------------- */
document
  .getElementById("editBranch-button")
  .addEventListener("click", function () {
    var button = document.getElementById("editBranch-button");
    var additionalButtons = document.getElementById("editBranchButtons");
    var redStarElements = document.querySelectorAll(
      ".box-condition-alarm2 .red-star-branch"
    );

    // 切換按鈕文字
    if (button.textContent === "編輯分支") {
      // 將按鈕文本改為新增分支，並進入編輯模式
      button.textContent = "新增分支";
      enterEditMode();
    } else {
      // 當按鈕文本是新增分支時，僅添加新的分支
      addNewBranch();
      updateBranchLabels();
    }

    // 清除現有按鈕
    additionalButtons.innerHTML = "";

    // 遍歷並更新所有的 red-star 元素
    redStarElements.forEach(function (redStar) {
      // 替換類別名稱，將 red-star 改為 deleteBranch-btn
      redStar.classList.remove("red-star-branch");
      redStar.classList.add("deleteBranch-btn");

      // 在label元素內創建一個新的span來放置減號圖示
      var minusIcon = document.createElement("span");
      minusIcon.innerHTML = "&#45;";
      minusIcon.className = "minus-icon";
      // 插入減號圖示到label，保持原有文字不變
      redStar.insertBefore(minusIcon, redStar.firstChild);

      // 為新的減號圖示添加點擊事件
      minusIcon.addEventListener("click", function (event) {
        event.stopPropagation(); // 阻止事件冒泡到label
        this.closest(".form-group-condition").remove(); // 刪除最近的 form-group-condition 元素
      });
    });

    // 为新的减号图标添加点击事件
    var minusIcons = document.querySelectorAll(".minus-icon");
    minusIcons.forEach(function (minusIcon) {
      minusIcon.addEventListener("click", function (event) {
        event.stopPropagation(); // 阻止事件冒泡到label
        var formGroup = this.closest(".form-group-condition");
        formGroup.remove(); // 删除最近的 form-group-condition 元素
        updateBranchLabels(); // 更新剩余分支的编号
      });
    });

    // 只有在'新增分支'模式下才添加“儲存”和“取消”按鈕
    if (button.textContent === "新增分支") {
      // 創建“儲存”按鈕
      var saveButton = document.createElement("button");
      saveButton.textContent = "儲存";
      saveButton.className = "saveBranch-button";
      additionalButtons.appendChild(saveButton);
      saveButton.addEventListener("click", function () {
        saveAndExitEditMode();
      });
    }

    updateMinusIcons(); // 调用函数以更新减号图标和它们的事件监听器
    bindSaveButton(); // 確保在每次進入編輯模式時重新綁定儲存按鈕
  });

function enterEditMode() {
  var additionalButtons = document.getElementById("editBranchButtons");

  // 清除現有按鈕
  additionalButtons.innerHTML = "";

  var redStarElements = document.querySelectorAll(
    ".box-condition-alarm2 .red-star-branch"
  );
  redStarElements.forEach(function (redStar) {
    redStar.classList.remove("red-star-branch");
    redStar.classList.add("deleteBranch-btn");

    var minusIcon = document.createElement("span");
    minusIcon.innerHTML = "&#45;";
    minusIcon.className = "minus-icon";
    redStar.insertBefore(minusIcon, redStar.firstChild);

    minusIcon.addEventListener("click", function (event) {
      event.stopPropagation();
      this.closest(".form-group-condition").remove();
      updateBranchLabels();
    });
  });

  updateMinusIcons();
}

function updateMinusIcons() {
  // 获取所有的 red-star 元素
  var redStarElements = document.querySelectorAll(
    ".box-condition-alarm2 .red-star-branch"
  );

  // 为每个 red-star 元素添加减号图标和点击事件
  redStarElements.forEach(function (redStar) {
    // 先清除现有的减号图标
    var existingMinus = redStar.querySelector(".minus-icon");
    if (existingMinus) {
      // 移除现有的监听器
      existingMinus.removeEventListener("click", minusIconClickHandler);
    } else {
      // 如果不存在现有的减号图标，则创建它
      var minusIcon = document.createElement("span");
      minusIcon.innerHTML = "&#45;";
      minusIcon.className = "minus-icon";
      redStar.insertBefore(minusIcon, redStar.firstChild);
      minusIcon.addEventListener("click", minusIconClickHandler);
    }
  });
}

// 保存當前狀態並退出編輯模式的函數
function saveAndExitEditMode() {
  var editBranchButton = document.getElementById("editBranch-button");
  editBranchButton.textContent = "編輯分支";

  var formGroups = document.querySelectorAll(
    ".box-condition-alarm2 .form-group-condition"
  );

  // 遍歷每個 formGroup，恢復標籤類別並移除減號圖示
  formGroups.forEach(function (formGroup) {
    var label = formGroup.querySelector("label");
    var minusIcon = formGroup.querySelector(".minus-icon");
    if (label) {
      label.classList.remove("deleteBranch-btn");
      label.classList.add("red-star-branch");
    }
    if (minusIcon) {
      minusIcon.remove(); // 移除減號圖示
    }
  });

  // 清除附加按鈕容器內的所有內容
  var additionalButtons = document.getElementById("editBranchButtons");
  additionalButtons.innerHTML = "";
}

// 綁定儲存按鈕事件到所有儲存按鈕
function bindSaveButton() {
  var saveButton = document.querySelector(".saveBranch-button");
  if (saveButton) {
    saveButton.addEventListener("click", saveAndExitEditMode);
  }
}

/* -------------------- 减号图标点击事件处理器 ----------------------- */
function minusIconClickHandler(event) {
  event.stopPropagation(); // 阻止事件冒泡到label
  this.closest(".form-group-condition").remove();
  updateBranchLabels();
}

// 更新剩余分支的编号
function updateBranchLabels() {
  var branchLabels = document.querySelectorAll(
    ".box-condition-alarm2 .deleteBranch-btn" // 更新使用新的類別名稱
  );
  branchLabels.forEach(function (label, index) {
    // 只更新標籤文字，保留減號圖示
    var minusIcon = label.querySelector(".minus-icon");
    label.textContent = "分支" + (index + 1) + "：";
    label.insertBefore(minusIcon, label.firstChild);
  });
}

function addNewBranch() {
  var container = document.querySelector(".box-condition-alarm2");
  var numberOfBranches = container.children.length;

  // 檢查是否已達到分支上限
  if (numberOfBranches >= 15) {
    alert("分支數量已達到上限，無法再新增分支。");
    return; // 終止函數執行
  }

  var formGroup = document.createElement("div");
  formGroup.className = "form-group-condition";

  // 創建標籤
  var label = document.createElement("label");
  label.className = "deleteBranch-btn"; // 使用刪除功能的類別名稱
  label.textContent = "分支" + (numberOfBranches + 1) + "：";

  // "新增分支"建立的項目添加刪除按鈕與功能
  var minusIcon = document.createElement("span");
  minusIcon.innerHTML = "&#45;";
  minusIcon.className = "minus-icon";
  label.appendChild(minusIcon);

  // 創建下拉選擇框等其他元素，可以複用createCustomSelect函數
  var customSelect1 = createCustomSelect(
    "維修類型",
    "custom-select-alarm1",
    "invoice-options-" + (numberOfBranches + 1) + "-type"
  );

  var customSelect2 = createCustomSelect(
    "維修項目",
    "custom-select-alarm2",
    "invoice-options-" + (numberOfBranches + 1) + "-item"
  );

  // 將元素添加到formGroup
  formGroup.appendChild(label);
  formGroup.appendChild(customSelect1);
  formGroup.appendChild(customSelect2);

  container.appendChild(formGroup);

  // 調用updateBranchLabels函數更新"新增分支"建立的分支標籤並為新分支添加刪除功能
  minusIcon.addEventListener("click", function (event) {
    event.stopPropagation();
    formGroup.remove();
    updateBranchLabels();
  });
}

// 初始化时调用
updateMinusIcons();
