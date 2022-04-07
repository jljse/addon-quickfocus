
const defaultOptions = {
  'hotkeyCtrl': true,
  'hotkeyShift': true,
  'hotkeyAlt': false,
  'hotkeyMeta': false,
  'hotkeyText': 'F',
  'colorBorder': 'pink',
  'colorText': 'black',
  'colorBg': '#ffffffaa',
}

async function loadOptions() {
  return await browser.storage.local.get(defaultOptions)
}

async function saveOptions(opts) {
  await browser.storage.local.set(opts)
}
