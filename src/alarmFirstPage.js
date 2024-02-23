// 页面加载时初始化
window.addEventListener('DOMContentLoaded', function () {
  initCollapsibles() // 初始化可折叠元素
  addClickToMaintainHoverEffect() // 为 final-item 添加点击事件以保持 hover 效果
  displayMachineInfoOnNewPage() // 在新页面显示机台信息
})

// 初始化所有可折叠元素，设置为收起状态
function initCollapsibles() {
  var allCollapsibles = document.querySelectorAll('.collapsible')
  allCollapsibles.forEach(function (collapsible) {
    var content = collapsible.nextElementSibling
    content.style.display = 'none'
    var arrow = collapsible.querySelector('.arrow')
    arrow.style.transform = 'rotate(0deg)'
    arrow.classList.remove('down')
  })
}

// 为 final-item 添加点击事件，以保持 hover 效果
function addClickToMaintainHoverEffect() {
  let finalItems = document.querySelectorAll('.content-alarm .final-item')
  finalItems.forEach(function (item) {
    item.addEventListener('click', function (event) {
      removeActiveClass()
      this.classList.add('active')
      this.style.color = '#252525'
      this.style.backgroundColor = '#ffffff'
      event.stopPropagation()
    })
  })
}

// 移除所有 final-item 的 active 类
function removeActiveClass() {
  document.querySelectorAll('.final-item.active').forEach(function (item) {
    item.classList.remove('active')
    item.style.color = ''
    item.style.backgroundColor = ''
  })
}

// 在 addNewMachine.html 页面显示机台信息
function displayMachineInfoOnNewPage() {
  if (window.location.pathname.includes('addNewMachine.html')) {
    var machineInfo = localStorage.getItem('machineInfo')
    var machineInfoDisplay = document.getElementById('machineInfoDisplay')
    if (machineInfoDisplay && machineInfo) {
      machineInfoDisplay.textContent = machineInfo
    }
  }
}

// 编辑按钮点击事件
document.getElementById('edit-button').addEventListener('click', function () {
  alert('编辑功能尚未实现')
})

// 模态框保存按钮点击事件
document
  .getElementById('openModalBtn-machine')
  .addEventListener('click', function () {
    var machineCategory = document.querySelector(
      '.machine-Info[name="invoice-number"]',
    ).value
    var modelSeries = document.querySelectorAll(
      '.machine-Info[name="invoice-number"]',
    )[1].value
    var machineModel = document.querySelector('.input-machineModel').value

    // 检查所有字段是否已填写
    if (!machineCategory || !modelSeries || !machineModel) {
      alert('所有欄位必須填寫完畢。')
      return
    }

    // 更新 newMachineItem 的文本并保存机台信息到 localStorage
    updateNewMachineItem(machineModel)
    saveMachineInfoToLocalStorage(machineCategory)

    // 创建并添加新的列表项到菜单
    createAndAddNewListItem(machineCategory, modelSeries, machineModel)

    // 关闭模态框和覆盖层
    closeModalAndOverlay()
  })

// 更新 newMachineItem 的文本内容
function updateNewMachineItem(machineModel) {
  var newMachineItem = document.querySelector('.newMachineItem .btn-new')
  newMachineItem.textContent = machineModel
}

// 将机台信息保存到 localStorage
function saveMachineInfoToLocalStorage(machineInfo) {
  localStorage.setItem('machineInfo', machineInfo)
}

// 创建并添加新的列表项到左侧菜单
function createAndAddNewListItem(machineCategory, modelSeries, machineModel) {
  var newListItem = document.createElement('div')
  newListItem.classList.add('menu-item-alarm')
  newListItem.innerHTML = `
    <div class="collapsible" onclick="toggleContent(event, this)">
      <span class="arrow">></span>${machineCategory}
    </div>
    <div class="content-alarm" style="display: none;">
      <div class="sub-menu-item">
        <div class="collapsible" onclick="toggleContent(event, this)">
          <span class="arrow">></span>${modelSeries}
        </div>
        <div class="content-alarm" style="display: none;">
          <div class="final-item"><span class="dot"></span>${machineModel}</div>
        </div>
      </div>
    </div>`
  var menuContainer = document.querySelector('.menu')
  menuContainer.appendChild(newListItem)
  addClickToMaintainHoverEffect()
}

// 关闭模态框和覆盖层
function closeModalAndOverlay() {
  var modal = document.getElementById('myModal')
  var modalOverlay = document.getElementById('modalOverlay')
  modal.style.display = 'none'
  modalOverlay.style.display = 'none'
}

// 绑定显示模态窗口的按钮事件
var openModalButton = document.getElementById('addMachineBtn')
if (openModalButton) {
  openModalButton.addEventListener('click', showModal)
}

// 显示模态窗口
function showModal() {
  document
    .querySelectorAll('.machine-Info')
    .forEach((input) => (input.value = ''))
  document.querySelector('.input-machineModel').value = ''
  var modal = document.getElementById('myModal')
  var modalOverlay = document.getElementById('modalOverlay')
  modal.style.display = 'block'
  modalOverlay.style.display = 'block'
}

// 切换内容展开与否的函数
function toggleContent(event, element) {
  let content = element.nextElementSibling
  let arrow = element.querySelector('.arrow')
  content.style.display = content.style.display === 'block' ? 'none' : 'block'
  arrow.style.transform =
    content.style.display === 'block' ? 'rotate(90deg)' : 'rotate(0deg)'
  arrow.classList.toggle('down')
  event.stopPropagation()
}

// 删除所有列表项的函数
function removeAllMenuItems() {
  var menuItems = document.querySelectorAll('.menu-item-alarm')
  menuItems.forEach(function (menuItem) {
    menuItem.remove() // 删除当前菜单项
  })
}
