document.addEventListener("DOMContentLoaded", function () {
  if (typeof hideOriginalMenuItems === "function") {
    hideOriginalMenuItems();
  }
  if (typeof initializeCollapsibleItems === "function") {
    initializeCollapsibleItems();
  }
  if (typeof loadSavedDataAndUpdateList === "function") {
    loadSavedDataAndUpdateList();
  }

  if (typeof addClickToUpdateTitle === "function") {
    addClickToUpdateTitle();
  }

  bindModalEvents();

  // 页面初始化时更新 btn-showMachine
  initializePage();
});

function bindModalEvents() {
  // 绑定打开模态框的按钮
  var openModalButtonKnowledge = document.querySelector(
    ".button.knowledge-btn"
  );
  // 確保按鈕存在
  if (openModalButtonKnowledge) {
    openModalButtonKnowledge.addEventListener("click", function (event) {
      event.preventDefault();
      var modalMachine = document.getElementById("myModalMachine");
      var overlayMachine = document.getElementById("modalOverlayMachine");
      showModal(modalMachine, overlayMachine);
    });
  }

  // 绑定关闭模态框的按钮
  var closeModalBtnMachine = document.getElementById("closeModalBtnMachine");
  if (closeModalBtnMachine) {
    closeModalBtnMachine.addEventListener("click", function () {
      var modalMachine = document.getElementById("myModalMachine");
      var overlayMachine = document.getElementById("modalOverlayMachine");
      hideModal(modalMachine, overlayMachine);
    });
  }

  // 绑定保存按钮的点击事件
  var saveButton = document.querySelector("#myModalMachine .button.btn-save");
  if (saveButton) {
    saveButton.addEventListener("click", function () {
      var machineInfos = document.querySelectorAll(".machine-Info");
      var modelSeries = machineInfos[1].value;
      var machineModel = document.querySelector(".input-machineModel").value;
      var machineCategory = machineInfos[0].value;

      // 保存到 localStorage
      var newMachine = { machineCategory, modelSeries, machineModel };
      var existingData = JSON.parse(localStorage.getItem("newMachines")) || [];
      existingData.push(newMachine);
      localStorage.setItem("newMachines", JSON.stringify(existingData));

      // 保存当前机台信息
      localStorage.setItem("currentMachineInfo", machineModel);

      console.log("Saved machineModel to localStorage: ", machineModel);

      // 重新加载并更新菜单列表
      loadSavedDataAndUpdateList();

      // 更新页面显示的文本
      updateDisplayText(modelSeries, machineModel);

      // 重定向到 addKnowledge.html
      window.location.href = "./addKnowledge.html";
    });
  }
}

function showModal(modal, overlay) {
  clearModalInputs(modal);
  modal.style.display = "block";
  overlay.style.display = "block";
}

function hideModal(modal, overlay) {
  modal.style.display = "none";
  overlay.style.display = "none";
}

function clearModalInputs(modal) {
  var inputs = modal.querySelectorAll("input");
  inputs.forEach((input) => {
    if (!input.classList.contains("input-account")) {
      input.value = "";
    }
  });
}

// 在调用 updateNewMachineItemDisplay 之前
console.log(
  "Before calling updateNewMachineItemDisplay: ",
  document.querySelector(".btn-showMachine").textContent
);

// 更新待新增项目显示的函数
function updateNewMachineItemDisplay(machineModel) {
  var btnShowMachine = document.querySelector(".btn-showMachine");
  if (btnShowMachine) {
    console.log(
      "updateNewMachineItemDisplay - Before update: ",
      btnShowMachine.textContent
    );
    btnShowMachine.textContent = machineModel;
    console.log(
      "updateNewMachineItemDisplay - After update: ",
      btnShowMachine.textContent
    );
    var currentPage = window.location.pathname;
    if (
      currentPage.endsWith("addKnowledge.html") ||
      currentPage.endsWith("SOP.html") ||
      currentPage.endsWith("previewFile.html")
    ) {
      btnShowMachine.style.color = "#266df7"; // 在这些页面上设置文字颜色
    }
  }
}

// ...在逻辑执行完毕后
console.log(
  "After modal save logic: ",
  document.querySelector(".btn-showMachine").textContent
);

// 從 localStorage 獲取必要的數據更新 btn-showMachine
function initializePage() {
  var machineModel = localStorage.getItem("currentMachineInfo");
  if (machineModel) {
    updateNewMachineItemDisplay(machineModel);
  }
}

// 更新页面显示的文本
function updateDisplayText(modelSeries, machineModel) {
  var displayElementSeries = document.querySelector("h2");
  var btnShowMachine = document.querySelector(".btn-showMachine");

  if (displayElementSeries) {
    displayElementSeries.textContent = `${modelSeries}系列`;
  }

  if (btnShowMachine) {
    btnShowMachine.textContent = machineModel;
  }

  // 存储用于在addKnowledge.html中显示的当前机台信息
  localStorage.setItem("currentMachineInfo", machineModel);
}

// 加载保存的数据并更新列表
function loadSavedDataAndUpdateList() {
  var existingData = localStorage.getItem("newMachines")
    ? JSON.parse(localStorage.getItem("newMachines"))
    : [];
  var menuContainer = document.querySelector(".menu");

  if (menuContainer) {
    // 清空現有列表項目
    while (menuContainer.firstChild) {
      menuContainer.removeChild(menuContainer.firstChild);
    }

    existingData.forEach(function (data) {
      var newListItem = document.createElement("div");
      newListItem.classList.add("menu-item-alarm");
      newListItem.innerHTML = `
      <div class="collapsible" onclick="toggleContent(event, this)">
        <span class="arrow">></span>${data.machineCategory}
      </div>
      <div class="content-alarm" style="display: none;">
        <div class="sub-menu-item">
          <div class="collapsible" onclick="toggleContent(event, this)">
            <span class="arrow">></span>${data.modelSeries}
          </div>
          <div class="content-alarm" style="display: none;">
            <div class="final-item"><span class="dot"></span>${data.machineModel}</div>
          </div>
        </div>
      </div>`;
      if (menuContainer) {
        menuContainer.appendChild(newListItem);
        initializeCollapsibleItems(); // 重新初始化可折叠项
      }
    });
  }
}
