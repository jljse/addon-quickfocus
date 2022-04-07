function log(msg) {
  document.querySelector('#msg').innerText += "\n" + msg
}

function restoreValues(opts) {
  document.querySelector('#hotkey-ctrl').checked = opts.hotkeyCtrl
  document.querySelector('#hotkey-shift').checked = opts.hotkeyShift
  document.querySelector('#hotkey-alt').checked = opts.hotkeyAlt
  document.querySelector('#hotkey-meta').checked = opts.hotkeyMeta
  document.querySelector('#hotkey-text').value = opts.hotkeyText
  document.querySelector('#color-border').value = opts.colorBorder
  document.querySelector('#color-text').value = opts.colorText
  document.querySelector('#color-bg').value = opts.colorBg
}

function gatherValues() {
  const opts = {
    hotkeyCtrl: document.querySelector('#hotkey-ctrl').checked,
    hotkeyShift: document.querySelector('#hotkey-shift').checked,
    hotkeyAlt: document.querySelector('#hotkey-alt').checked,
    hotkeyMeta: document.querySelector('#hotkey-meta').checked,
    hotkeyText: document.querySelector('#hotkey-text').value,
    colorBorder: document.querySelector('#color-border').value,
    colorText: document.querySelector('#color-text').value,
    colorBg: document.querySelector('#color-bg').value,
  }
  return opts
}

async function submitAction(event) {
  event.preventDefault()
  try {
    await saveOptions(gatherValues())
  } catch(ex) {
    log(ex.toString())
  }
}

async function resetAction(event) {
  event.preventDefault()
  try {
    restoreValues(defaultOptions)
    await saveOptions(defaultOptions)
  } catch(ex) {
    log(ex.toString())
  }
}

try {
  loadOptions().then(opts => restoreValues(opts))
  document.querySelector('#form').addEventListener('submit', submitAction)
  document.querySelector('#form').addEventListener('reset', resetAction)
} catch(ex) {
  log(ex.toString())
}
