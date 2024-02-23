/* ----------------- Page 3 (SOP)----------------- */

// 全局变量
let activeStep = null;
let stepCount = 0;
let activeStepNumber = null;
let isEditMode = false;
let stepContent = {
  description: {},
  remarks: {},
  stepImage: {},
  remarksImage: {},
};

// 处理文件改变的事件
function handleImageChange(type, imageInput) {
  const file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      // 保存圖片的 base64 编码到 stepContent 對象
      stepContent[type][`step${activeStepNumber}`] = e.target.result;
      // 顯示新上傳的圖片
      displayImagesForStep(activeStepNumber);
      // 清除 input 的值以便再次上传相同文件
      imageInput.value = "";

      // 保存到 localStorage
      localStorage.setItem(`${type}Step${activeStepNumber}`, e.target.result);
    };
    reader.readAsDataURL(file);
  }
}

// step欄位 - trash-icon功能刪除內容
function removeStep(stepNumber) {
  // 如果是第一步，只清空内容
  if (stepNumber === 1) {
    clearStepContent(stepNumber);
  } else {
    const stepElem = document.querySelector(`.step[data-step="${stepNumber}"]`);
    if (stepElem) {
      stepElem.remove();
      clearStepContent(stepNumber);

      // 更新步驟計數
      stepCount--;

      // 更新步驟顯示並確定下一步要顯示的步驟
      const nextStepToShow = determineNextStepToShow(stepNumber);
      updateStepsDisplay(nextStepToShow.stepNumber, nextStepToShow.stepElement);
    }
  }
  // 更新 localStorage
  updateLocalStorageSteps();
}

function updateLocalStorageSteps() {
  const steps = document.querySelectorAll(".step");
  const stepsData = Array.from(steps).map((step) =>
    step.getAttribute("data-step")
  );
  localStorage.setItem("stepsData", JSON.stringify(stepsData));
}

// step右側欄位內容刪除、更新、儲存
function clearStepContent(stepNumber) {
  // 清除內容和圖片
  delete stepContent.description[`step${stepNumber}`];
  delete stepContent.remarks[`step${stepNumber}`];
  delete stepContent.stepImage[`step${stepNumber}`];
  delete stepContent.remarksImage[`step${stepNumber}`];

  // 更新 localStorage
  localStorage.removeItem(`descriptionStep${stepNumber}`);
  localStorage.removeItem(`remarksStep${stepNumber}`);
  localStorage.removeItem(`stepImageStep${stepNumber}`);
  localStorage.removeItem(`remarksImageStep${stepNumber}`);

  // 如果当前活动步骤是被清空的步骤，更新右侧内容显示
  if (stepNumber === activeStepNumber) {
    syncRightContent(stepNumber);
  }
}

// 步驟step欄位刪除顯示
function determineNextStepToShow(deletedStepNumber) {
  const steps = Array.from(document.querySelectorAll(".step")).map((step) =>
    parseInt(step.getAttribute("data-step"))
  );

  // 查找被删除步骤的索引
  const deletedStepIndex = steps.indexOf(deletedStepNumber);

  if (steps.length === 0) {
    return { stepNumber: null, stepElement: null };
  }

  let nextStepIndex;

  if (deletedStepIndex === 0 && steps.length > 1) {
    // 如果删除的是第一个步骤且还有其它步骤，显示下一个步骤
    nextStepIndex = 1;
  } else {
    // 否则显示前一个步骤，或者如果没有其它步骤，则不显示
    nextStepIndex = Math.max(deletedStepIndex - 1, 0);
  }

  // 確定顯示哪一步
  const nextStepToShow = steps[nextStepIndex] || null;

  return {
    stepNumber: nextStepToShow,
    stepElement: nextStepToShow
      ? document.querySelector(`.step[data-step="${nextStepToShow}"]`)
      : null,
  };
}

// 步驟step欄位顯示判斷
function updateStepsDisplay(nextStepNumber, nextStepElement) {
  const steps = document.querySelectorAll(".step");
  steps.forEach((step, index) => {
    step.firstChild.nodeValue = `步驟 ${index + 1}`;
    step.setAttribute("data-step", index + 1);
  });

  // 如果有步驟，則顯示指定的步驟
  if (nextStepElement) {
    setActiveStep(nextStepNumber, nextStepElement);
  } else {
    activeStep = null;
    activeStepNumber = null;
  }
}

// 新增step欄位步驟顯示樣式
function addStep() {
  // 获取当前最大步骤编号
  const existingSteps = document.querySelectorAll(".step");
  const currentMaxStepNumber =
    existingSteps.length > 0
      ? Math.max(
          ...Array.from(existingSteps).map((el) =>
            parseInt(el.getAttribute("data-step"))
          )
        )
      : 0;
  const newStepNumber = currentMaxStepNumber + 1;

  // 创建新步骤
  const stepElem = document.createElement("div");
  stepElem.className = "step";
  stepElem.textContent = `步驟 ${newStepNumber}`;
  stepElem.setAttribute("data-step", newStepNumber);

  const trashIcon = document.createElement("img");
  trashIcon.src = "./icon/垃圾桶.png";
  trashIcon.className = "trash-icon";
  trashIcon.alt = "Delete Step";

  stepElem.appendChild(trashIcon);
  document.getElementById("stepContainer").appendChild(stepElem);

  stepElem.addEventListener("click", function () {
    setActiveStep(newStepNumber, stepElem);
  });

  // 更新 localStorage
  updateLocalStorageSteps();
}

// 将 setActiveStep 调整为显示正确的内容
function setActiveStep(stepNumber, stepElem) {
  activeStepNumber = stepNumber;

  if (activeStep) {
    activeStep.style.backgroundColor = "";
    activeStep.style.color = "";
  }
  stepElem.style.backgroundColor = "#46a3c2";
  stepElem.style.color = "#FFFFFF";
  activeStep = stepElem;

  showStepContent(stepNumber);

  // 确保右侧内容栏显示当前活动步骤的信息
  syncRightContent(stepNumber);

  displayImagesForStep(stepNumber);
}

function syncRightContent(stepNumber) {
  // 获取对应步骤的内容
  const stepDesc = stepContent.description[`step${stepNumber}`] || "";
  const stepRemarks = stepContent.remarks[`step${stepNumber}`] || "";
  const stepImageURL = stepContent.stepImage[`step${stepNumber}`] || "";
  const remarksImageURL = stepContent.remarksImage[`step${stepNumber}`] || "";

  // 更新右侧内容区域的文本
  const descriptionTextArea = document.getElementById("description");
  const remarksTextArea = document.getElementById("remarks");
  descriptionTextArea.value = stepDesc;
  remarksTextArea.value = stepRemarks;

  // 更新右侧内容区域的图片
  const stepImageElement = document.getElementById("stepImage");
  const remarksImageElement = document.getElementById("remarksImage");

  if (stepImageElement) {
    if (stepImageURL) {
      stepImageElement.src = stepImageURL;
      stepImageElement.style.display = "block";
    } else {
      stepImageElement.style.display = "none";
    }
  }

  if (remarksImageElement) {
    if (remarksImageURL) {
      remarksImageElement.src = remarksImageURL;
      remarksImageElement.style.display = "block";
    } else {
      remarksImageElement.style.display = "none";
    }
  }
}

// 為指定步驟顯示圖片
// displayImagesForStep 函数定义
function displayImagesForStep(stepNumber) {
  const stepImageUrl = stepContent.stepImage[`step${stepNumber}`] || "";
  const remarksImageUrl = stepContent.remarksImage[`step${stepNumber}`] || "";

  const stepImageElement = document.getElementById("stepImage");
  const remarksImageElement = document.getElementById("remarksImage");

  // 确保元素存在后再更新
  if (stepImageElement) {
    // 更新步骤图片
    updateImageDisplay(stepImageElement, stepImageUrl);
  }
  if (remarksImageElement) {
    // 更新备注图片
    updateImageDisplay(remarksImageElement, remarksImageUrl);
  }
}

function showStepContent(stepNumber) {
  // 更新活動步驟號碼
  activeStepNumber = stepNumber;

  // 設置文本區域的值
  document.getElementById("description").value =
    stepContent["description"][`step${stepNumber}`] || "";
  document.getElementById("remarks").value =
    stepContent["remarks"][`step${stepNumber}`] || "";

  // 更新圖片顯示
  const stepImageUrl = localStorage.getItem(`stepImageStep${stepNumber}`);
  const remarksImageUrl = localStorage.getItem(`remarksImageStep${stepNumber}`);

  updateImageDisplay(document.getElementById("stepImage"), stepImageUrl || "");
  updateImageDisplay(
    document.getElementById("remarksImage"),
    remarksImageUrl || ""
  );

  // 調用 displayImagesForStep 來顯示圖片
  displayImagesForStep(stepNumber);
}

// 更新图片显示逻辑
function updateImageDisplay(imageElement, imageUrl) {
  if (imageUrl) {
    imageElement.src = imageUrl;
    imageElement.style.display = "block";
  } else {
    imageElement.style.display = "none";
  }
}

// add step
document.addEventListener("DOMContentLoaded", function () {
  let activeStep = null;
  let isEditMode = false;

  const openModalBtnSOP = document.getElementById("openModalBtn-SOP");
  const saveBtn = document.getElementById("saveBtn");

  saveBtn.addEventListener("click", function (e) {
    e.preventDefault();
    // SOP名稱替換
    const sopNameInput = document.getElementById("sopNameInput");
    const sopName = sopNameInput.value;

    // 將SOP名稱保存到localStorage
    localStorage.setItem("sopName", sopName);

    document.getElementById("modalOverlay").style.display = "none";
    document.getElementById("myModal").style.display = "none";
    if (isEditMode) {
      openModalBtnSOP.innerText = "儲存";
      isEditMode = false;
    } else {
      openModalBtnSOP.innerText = "編輯";
      isEditMode = true;
    }
  });

  openModalBtnSOP.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("modalOverlay").style.display = "block";
    document.getElementById("myModal").style.display = "block";
  });

  document.getElementById("delete-btn").addEventListener("click", function () {
    removeImage("stepImage");
  });

  // // 當頁面加載完成後，自動顯示第一步驟的欄位
  // addStep();

  // 监听左侧步骤栏的点击事件，同步更改右侧内容
  const stepContainers = document.querySelectorAll(".step");
  stepContainers.forEach((stepElem, index) => {
    stepElem.addEventListener("click", function () {
      // 检查并更新 activeStep
      if (activeStep) {
        activeStep.style.backgroundColor = "";
        activeStep.style.color = "";
      }
      stepElem.style.backgroundColor = "#46a3c2";
      stepElem.style.color = "#FFFFFF";
      activeStep = stepElem;

      const stepNumber = index + 1;
      // 同步右侧内容
      syncRightContent(stepNumber);
    });
  });

  // 第一步驟綁定右側內容
  // Function to show the content of the first step on page load
  function showFirstStepContent() {
    const firstStep = document.querySelector(".step");
    if (firstStep) {
      firstStep.click(); // Simulate a click on the first step
    }
  }

  document
    .getElementById("stepContainer")
    .addEventListener("click", function (e) {
      // 检查点击目标是否为垃圾桶图标
      if (e.target && e.target.classList.contains("trash-icon")) {
        // 获取步骤编号
        const stepNumber = parseInt(
          e.target.closest(".step").getAttribute("data-step")
        );
        removeStep(stepNumber);
      }
    });

  // --------------------------------------------------------------------- /

  // 初始化第一个步骤的显示
  showFirstStepContent();
});
// -----------------------------------------------------------------------------
// 儲存按鈕彈出視窗
document.addEventListener("DOMContentLoaded", function () {
  let sopNumber = 1; // 初始編號

  // Open modal
  document
    .getElementById("openModalBtn-SOP")
    .addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("sopNumberLabel").innerText =
        "編號：" + sopNumber; // 每次打開模態視窗時，都會更新編號
      document.getElementById("modalOverlay").style.display = "block";
    });

  // 当打开模态框时，保存初始的SOP名称，并更改按钮文本
  document
    .getElementById("openModalBtn-SOP")
    .addEventListener("click", function () {
      initialSOPName = document.querySelector(".input-SOPName").value;
      document.getElementById("modalOverlay").style.display = "block";
      document.getElementById("myModal").style.display = "block";
      this.innerText = "編輯"; // 更改按钮文本为“編輯”
    });

  // 处理“保存”按钮的点击事件
  document.getElementById("saveBtn").addEventListener("click", function () {
    // 获取并保存当前的SOP名称
    const currentSOPName = document.querySelector(".input-SOPName").value;
    // 可以在这里添加保存到localStorage的代码
    // 关闭模态框
    document.getElementById("modalOverlay").style.display = "none";
    document.getElementById("myModal").style.display = "none";
  });

  // 处理“取消”按钮的点击事件
  document.getElementById("cancelBtn").addEventListener("click", function () {
    // 显示确认对话框
    var confirmClose = confirm("是否不保存此次SOP名稱並關閉視窗？");
    if (confirmClose) {
      // 用户点击了“确认”，则恢复到初始的SOP名称并关闭模态框
      document.querySelector(".input-SOPName").value = initialSOPName;
      document.getElementById("modalOverlay").style.display = "none";
      document.getElementById("myModal").style.display = "none";
    }
  });

  document
    .querySelector(".upload-btn-step")
    .addEventListener("click", function () {
      uploadImage("stepImage");
    });

  // 為步驟圖片的刪除按鈕添加事件處理器
  document
    .querySelector(".delete-btn-step")
    .addEventListener("click", function () {
      removeImage("stepImage");
    });

  // 為備註圖片的上傳按鈕添加事件處理器
  document
    .querySelector(".upload-btn-remarks")
    .addEventListener("click", function () {
      uploadImage("remarksImage");
    });

  // 為備註圖片的刪除按鈕添加事件處理器
  document
    .querySelector(".delete-btn-remarks")
    .addEventListener("click", function () {
      removeImage("remarksImage");
    });

  // 上傳圖片功能
  function uploadImage(type) {
    const imageInput = document.getElementById(`${type}-image-input`);
    // 直接为 onchange 事件赋值
    imageInput.onchange = () => handleImageChange(type, imageInput);
    imageInput.click();

    imageInput.onchange = () => {
      const file = imageInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          // 保存图片的 base64 编码到 stepContent 对象
          stepContent[type][`step${activeStepNumber}`] = e.target.result;

          // 显示新上传的图片
          displayImagesForStep(activeStepNumber);

          // 保存到 localStorage
          localStorage.setItem(
            `${type}Step${activeStepNumber}`,
            e.target.result
          );
        };
        reader.readAsDataURL(file);
      }
    };
  }

  function removeImage(imageType) {
    var inputId, imageId, placeholderId;
    if (imageType === "stepImage") {
      inputId = "stepImage-image-input";
      imageId = "stepImage";
    } else if (imageType === "remarksImage") {
      inputId = "remarksImage-image-input";
      imageId = "remarksImage";
    }

    var inputElement = document.getElementById(inputId);
    var imgElement = document.getElementById(imageId);
    if (inputElement && imgElement) {
      inputElement.value = ""; // 清除已选中的文件
      imgElement.style.display = "none"; // 隐藏图片
      imgElement.src = "";
    }
  }

  // 儲存按鈕進行檔案儲存
  document.getElementById("saveBtn").addEventListener("click", function (e) {
    e.preventDefault();
    // 您的儲存邏輯在此處
    console.log("已儲存"); // 模擬保存操作的日志。您可以替換為實際的儲存邏輯。

    // 更改按鈕文本為「編輯」
    document.getElementById("openModalBtn-SOP").textContent = "編輯";

    // 隐藏模态框
    document.getElementById("modalOverlay").style.display = "none";
    document.getElementById("myModal").style.display = "none";
  });

  // 模态框的叉叉（關閉）按钮点击事件
  document
    .getElementById("closeModalBtn")
    .addEventListener("click", function () {
      // 只关闭模态框，不更改任何按钮的文本
      document.getElementById("modalOverlay").style.display = "none";
      document.getElementById("myModal").style.display = "none";

      // 將按鈕文本更改回「儲存」
      document.getElementById("openModalBtn-SOP").textContent = "儲存";
    });
  // ---------------------------------------------------------------------------------

  // 偵測SOP內容顯示到預覽新增內的文字內容框框
  // 當在第一個頁面的textarea輸入後，儲存到localStorage
  document.getElementById("description").addEventListener("input", function () {
    stepContent["description"][`step${activeStepNumber}`] = this.value;
    // 保存到 localStorage，为每个步骤创建一个唯一的键
    localStorage.setItem(`descriptionStep${activeStepNumber}`, this.value);
  });

  document.getElementById("remarks").addEventListener("input", function () {
    stepContent["remarks"][`step${activeStepNumber}`] = this.value;
    // 保存到 localStorage，为每个步骤创建一个唯一的键
    localStorage.setItem(`remarksStep${activeStepNumber}`, this.value);
  });
});

// 當第二個頁面加載時，從localStorage讀取並設定到對應的欄位
document.addEventListener("DOMContentLoaded", function () {
  // 读取存储在 localStorage 中的文本内容
  const descriptionContent = localStorage.getItem("descriptionData");
  const remarksContent = localStorage.getItem("remarksData");

  // 获取 textarea 元素并设置其值
  const descriptionTextArea = document.getElementById("description");
  const remarksTextArea = document.getElementById("remarks");
  if (descriptionContent) {
    descriptionTextArea.value = descriptionContent;
  }
  if (remarksContent) {
    remarksTextArea.value = remarksContent;
  }

  // 读取存储在 localStorage 中的图片 URL
  const stepImageUrl = localStorage.getItem("stepImageStep" + activeStepNumber);
  const remarksImageUrl = localStorage.getItem(
    "remarksImageStep" + activeStepNumber
  );

  // 获取 img 元素并设置其 src 属性
  const stepImageElement = document.getElementById("stepImage");
  const remarksImageElement = document.getElementById("remarksImage");
  if (stepImageUrl) {
    stepImageElement.src = stepImageUrl;
    stepImageElement.style.display = "block"; // 顯示圖片
  } else {
    stepImageElement.style.display = "none"; // 隱藏圖片
  }
  if (remarksImageUrl) {
    remarksImageElement.src = remarksImageUrl;
    remarksImageElement.style.display = "block";
  } else {
    remarksImageElement.style.display = "none";
  }

  // 加载保存的步骤内容
  for (let i = 1; i <= stepCount; i++) {
    const savedDescription = localStorage.getItem(`descriptionStep${i}`);
    const savedRemarks = localStorage.getItem(`remarksStep${i}`);
    const savedStepImage = localStorage.getItem(`stepImageStep${i}`);
    const savedRemarksImage = localStorage.getItem(`remarksImageStep${i}`);

    if (savedDescription) {
      stepContent["description"][`step${i}`] = savedDescription;
    }
    if (savedRemarks) {
      stepContent["remarks"][`step${i}`] = savedRemarks;
    }
    if (savedStepImage) {
      stepContent["stepImage"][`step${i}`] = savedStepImage;
    }
    if (savedRemarksImage) {
      stepContent["remarksImage"][`step${i}`] = savedRemarksImage;
    }
  }

  const descriptionInput = document.getElementById("description");
  const remarksInput = document.getElementById("remarks");

  // 恢復步驟說明的內容
  const savedDescription = localStorage.getItem("description");
  if (savedDescription) {
    descriptionInput.value = savedDescription;
  }

  // 恢復備註補充的內容
  const savedRemarks = localStorage.getItem("remarks");
  if (savedRemarks) {
    remarksInput.value = savedRemarks;
  }

  // 監聽輸入欄位的變化，並將內容保存到localStorage
  descriptionInput.addEventListener("input", function () {
    localStorage.setItem("description", descriptionInput.value);
  });

  remarksInput.addEventListener("input", function () {
    localStorage.setItem("remarks", remarksInput.value);
  });

  // 顯示第一步驟的內容
  showStepContent(1);
});
