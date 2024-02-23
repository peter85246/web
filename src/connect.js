document.addEventListener('DOMContentLoaded', function () {
  // 图片上传与显示
  bindImageUploadAndDelete()

  // 文字输入与显示
  bindTextInput()

  // 更新模态框中的 SOP 名称
  updateSOPName()

  // 处理预览按钮点击事件
  handlePreviewButton()

  // 顯示用戶輸入的資料
  displayStoredData()

  loadStoredData()

  function displayStoredData() {
    const fileNo = localStorage.getItem('invoiceNumber5')
    const errorCode = localStorage.getItem('invoiceNumber6')

    const infoBox = document.querySelector('.info-box')
    if (infoBox) {
      infoBox.innerHTML =
        `<p>File No : ${fileNo ? fileNo : ''}</p>` +
        `<p>Error Code : ${errorCode ? errorCode : ''}</p>`
    }

    // updateImage(
    //   ".image-container-page img[src='./圖片TS31103/For Model.jpg']",
    //   'modelImage',
    // )
    // updateImage(
    //   ".image-container-page img[src='./圖片TS31103/Tool.jpg']",
    //   'toolsImage',
    // )
    // updateImage(
    //   ".image-container-page img[src='./圖片TS31103/illustration.jpg']",
    //   'positionImage',
    // )
  }

  function updateImage(selector, localStorageKey) {
    const imageElement = document.querySelector(selector)
    if (imageElement) {
      imageElement.src =
        localStorage.getItem(localStorageKey) || './預設圖片路徑/預設圖片.jpg'
    }
  }

  // 綁定儲存按鈕的點擊事件
  const saveBtn = document.getElementById('btn-save-js') // 使用 "儲存" 按鈕的 ID
  if (saveBtn) {
    saveBtn.addEventListener('click', function (event) {
      event.preventDefault() // 阻止鏈接的默認行為
      saveFormData()
      window.location.href = './SOP.html' // 跳轉到下一頁
    })
  }

  // 綁定預覽按鈕的點擊事件
  const previewBtn = document.getElementById('btn-preview') // 使用 "預覽" 按鈕的 ID
  if (previewBtn) {
    previewBtn.addEventListener('click', function (event) {
      event.preventDefault() // 阻止鏈接的默認行為
      saveFormData()
      window.location.href = './previewFile.html' // 跳轉到預覽頁面
    })
  }

  // 如果是 SOP.html 页面，绑定预览按钮的点击事件
  if (window.location.pathname.includes('SOP.html')) {
    const previewBtn = document.querySelector('.btn-preview')
    if (previewBtn) {
      previewBtn.addEventListener('click', function () {
        saveStepData()
        window.location.href = './previewFile.html'
      })
    }
  }

  // 如果是 previewFile.html 页面，加载存储的数据
  if (window.location.pathname.includes('previewFile.html')) {
    loadStoredData()
  }
})

function bindImageUploadAndDelete() {
  const imageButtons = document.querySelectorAll('.image-actions button')
  if (imageButtons) {
    imageButtons.forEach((button) => {
      button.addEventListener('click', function () {
        const actionType = this.classList.contains('upload-btn')
          ? 'upload'
          : 'delete'
        const id = this.className.split('-')[2]
        handleImageAction(id, actionType)
      })
    })
  }
}

function saveFormData() {
  // 儲存文本框資料
  localStorage.setItem(
    'invoiceNumber5',
    document.getElementById('invoice-number5').value,
  )
  localStorage.setItem(
    'invoiceNumber6',
    document.getElementById('invoice-number6').value,
  )

  // 儲存圖片資料
  localStorage.setItem(
    'modelImage',
    document.querySelector('.upload-btn-model').nextElementSibling.src,
  )
  localStorage.setItem(
    'toolsImage',
    document.querySelector('.upload-btn-tools').nextElementSibling.src,
  )
  localStorage.setItem(
    'positionImage',
    document.querySelector('.upload-btn-position').nextElementSibling.src,
  )
}

function handleImageAction(id, actionType) {
  // 省略已有的图片处理代码...
}

function bindTextInput() {
  const textBoxes = document.querySelectorAll('.fault-Info')
  if (textBoxes) {
    textBoxes.forEach((box) => {
      box.addEventListener('input', function () {
        const key = this.getAttribute('data-key')
        localStorage.setItem(key, this.value)
      })
    })
  }
}

function updateSOPName() {
  const saveBtn = document.getElementById('saveBtn')
  if (saveBtn) {
    // 省略已有的 SOP 名称更新代码...
  }
}

function handlePreviewButton() {
  const previewBtn = document.querySelector('.btn-preview')
  if (previewBtn) {
    previewBtn.addEventListener('click', function () {
      const descriptionElement = document.getElementById('description')
      const remarksElement = document.getElementById('remarks')
      if (descriptionElement && remarksElement) {
        localStorage.setItem('description', descriptionElement.value)
        localStorage.setItem('remarks', remarksElement.value)
      }

      // 保存图片
      const stepImageElement = document.getElementById('stepImage')
      const remarksImageElement = document.getElementById('remarksImage')
      if (stepImageElement && remarksImageElement) {
        localStorage.setItem('stepImage', stepImageElement.src)
        localStorage.setItem('remarksImage', remarksImageElement.src)
      }
    })
  }
}
function saveStepData() {
  const steps = document.querySelectorAll('.step')
  const stepData = []

  steps.forEach((step, index) => {
    const imageElement = step.querySelector('img')
    const textElement = step.querySelector('.text-box')

    stepData.push({
      image: imageElement ? imageElement.src : '',
      text: textElement ? textElement.value : '',
    })
  })

  localStorage.setItem('stepData', JSON.stringify(stepData))
}

function loadStoredData() {
  const stepCount = 10 // 假設的步驟數量

  for (let i = 1; i <= stepCount; i++) {
    // 構建步驟的存儲鍵
    const stepDescKey = `descriptionStep${i}`
    const remarksKey = `remarksStep${i}`
    const stepImageKey = `stepImageStep${i}`
    const remarksImageKey = `remarksImageStep${i}`

    // 從 localStorage 獲取數據
    const stepDesc = localStorage.getItem(stepDescKey)
    const remarks = localStorage.getItem(remarksKey)
    const stepImageUrl = localStorage.getItem(stepImageKey)
    const remarksImageUrl = localStorage.getItem(remarksImageKey)

    // 更新相應的步驟元素
    const stepElement = document.getElementById(`step${i}`)
    if (stepElement) {
      // 更新步驟說明文本
      const descElement = stepElement.querySelector(
        '.step-content .step-content-box',
      )
      if (descElement && stepDesc) {
        descElement.innerHTML = stepDesc
      }

      // 更新備註文本
      const remarksTextElement = stepElement.querySelectorAll(
        '.step-content .step-content-box',
      )[1]
      if (remarksTextElement && remarks) {
        remarksTextElement.innerHTML = remarks
      }

      // 更新步驟圖片
      const stepImageElement = stepElement.querySelector('.image-container img')
      if (stepImageElement && stepImageUrl) {
        stepImageElement.src = stepImageUrl
      }

      // 更新備註圖片
      const remarksImageElements = stepElement.querySelectorAll(
        '.step-content .step-content-box img',
      )
      const remarksImageElement =
        remarksImageElements[remarksImageElements.length - 1] // 選擇最後一個 img 元素
      if (remarksImageElement && remarksImageUrl) {
        remarksImageElement.src = remarksImageUrl
      }
    }
  }
  const textBoxes = document.querySelectorAll('.fault-Info')
  textBoxes.forEach((box) => {
    const key = box.getAttribute('data-key')
    if (key) {
      const storedValue = localStorage.getItem(key)
      if (storedValue !== null) {
        box.value = storedValue
      }
    }
  })

  updatePreviewContent()
}

function updatePreviewContent() {
  document.querySelectorAll('.info-box, .info-box2').forEach((box) => {
    const fileNo = localStorage.getItem('invoice-number5')
    const errorCode = localStorage.getItem('invoice-number6')

    box.innerHTML =
      `<p>File No : ${fileNo ? fileNo : ''}</p>` +
      `<p>Error Code : ${errorCode ? errorCode : ''}</p>`
  })
}

document.addEventListener('DOMContentLoaded', loadStoredData)
