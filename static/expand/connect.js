window.nodeRequire = require

delete window.module
delete window.require
delete window.exports

const {ipcRenderer} = nodeRequire('electron')
const fs = nodeRequire('fs')

ipcRenderer.on('msg', (ev, msg) => {
  console.log(msg)
  showTip(msg)
})

ipcRenderer.on('upload-file', (ev, msg) => {
  showTip('upload-file' + msg.path)
  const input = document.getElementById('file')
  const file = input.files[0]
  showTip(file.name)
  showTip(file.path)
  showTip(file.size)
  showTip(file.type)
})

function sendMessage () {
  ipcRenderer.sendToHost('hello host')
  ipcRenderer.send('user-events', 'click')
}

window.$sendMsg = sendMessage

const tips = []
function showTip (msg, time = 3000) {
  const tip = document.createElement('p')
  tip.setAttribute('style', `
    position: fixed;
    top: ${tips.length * 40 + 10}px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    line-height: 24px;
    padding: 5px;
    border-radius: 4px;
    z-index: 99999;
    box-shadow: 0 0 5px 0 rgba(0,0, 0, 0.4);
    color: #363636;
    transition: all .5s linear;
    opacity: .8;
  `)
  tip.innerText = msg
  document.body.appendChild(tip)
  tips.push(tip)
  setTimeout(() => {
    tip.style.opacity = 0
    setTimeout(() => {
      tip.remove()
      tips.splice(tips.indexOf(tip), 1)
      updateTip()
    }, 500)
  }, time)
}

function updateTip () {
  tips.forEach((tip, i) => {
    tip.style.top = `${i * 40 + 10}px`
  })
}

console.log('load', document)