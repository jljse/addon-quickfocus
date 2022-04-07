// defaultOptions.js should be loaded

const jumpKeys = [
  ...[...Array(9).keys()].map(i => ({ code: `Digit${i+1}`, key: `${i+1}`, text: `${i+1}` })),
  { code: `Digit0`, key: `0`, text: `0` },
  ..."ABCDEFGHIJ".split('').map(c => ({ code: `Key${c}`, key: `${c}`, text: `${c}`})),
]

let options = {}

function removeJumpMarker() {
  document.querySelectorAll('.quickfocuscheck').forEach((el) => {
    el.remove()
  })
  document.querySelectorAll('.quickfocuscheckref').forEach((el) => {
    el.className = el.className.split(' ').filter((c) => !c.includes('quickfocuscheck')).join(' ')
  })
}

function selectFocusable() {
  const queries = [
    'a[href]:not([tabindex="-1"]):not([disabled])',
    'input:not([tabindex="-1"]):not([disabled])',
    'textarea:not([tabindex="-1"]):not([disabled])',
    'select:not([tabindex="-1"]):not([disabled])',
    'button:not([tabindex="-1"]):not([disabled])',
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
  ]
  const focusables = [...document.querySelectorAll(queries.join(', '))]
  return focusables.filter(f => (
    !f.closest('[tabindex="-1"]') &&
    !f.closest('[disabled]')
  ))
}

function isInView(el) {
  const rect = el.getBoundingClientRect()
  return (
    rect.left > 0 &&
    rect.top > 0 &&
    rect.left < (window.innerWidth || document.documentElement.innerWidth) &&
    rect.top < (window.innerHeight || document.documentElement.innerHeight)
  )
}

function createJumpMarkerFor(el, key) {
  el.classList.add('quickfocuscheckref')
  el.classList.add(`quickfocuscheckref-${key}`)

  const rect = el.getBoundingClientRect()
  const elLeft = rect.left + window.scrollX
  const elTop = rect.top + window.scrollY

  marker = document.createElement('div')
  marker.className = 'quickfocuscheck'
  const styles = [
    `position: absolute`,
    `top: ${elTop}px`,
    `left: ${elLeft}px`,
    `display: flex`,
    `justify-content: center`,
    `align-items: center`,
    `font-size: 1.5rem`,
    `width: 30px`,
    `height: 30px`,
    `color: ${options.colorText}`,
    `background: ${options.colorBg}`,
    `border: 2px solid ${options.colorBorder}`,
    `border-radius: 4px`,
    `z-index: 9999`,
  ]
  marker.innerHTML = `
    <div style="${styles.join(';')}">
      <div>
        ${key}
      </div>
    </div>
  `.trim()
  document.body.appendChild(marker)
}

function createJumpMarker() {
  const els = selectFocusable().filter(isInView)

  const elementPerMarker = Math.max(1, els.length / jumpKeys.length)

  let nextMarkerIndex = 0
  els.forEach((el, index) => {
    if (index >= nextMarkerIndex * elementPerMarker) {
      createJumpMarkerFor(el, jumpKeys[nextMarkerIndex].text)
      nextMarkerIndex += 1
    }
  })
}

function jumpKeyCheck(event) {
  try {
    if (event.isComposite) {
      disable()
      return
    }
    if (event.ctrlKey || event.shiftKey || event.altKey) {
      disable()
      return
    }
    if (!event.key) {
      disable()
      return
    }

    const matchedKey = jumpKeys.find(x => x.key.toUpperCase() === event.key.toUpperCase())
    if (!matchedKey) {
      disable()
      return
    }

    const classSelector = `.quickfocuscheckref-${matchedKey.text}`
    const el = document.querySelector(classSelector)
    if (!el) {
      console.error(`not found selector ${classSelector}`)
      disable()
      return
    }

    el.focus()
    disable()
  } catch(ex) {
    console.error(ex)
  }
}

function scrollCheck(event) {
  try {
    disable()
  } catch(ex) {
    console.error(ex)
  }
}

function isEnabled() {
  return !!document.querySelector('.quickfocuscheck')
}

function disable() {
  removeJumpMarker()
  document.removeEventListener('keydown', jumpKeyCheck)
  document.removeEventListener('scroll', scrollCheck)
}

function enable() {
  removeJumpMarker()
  createJumpMarker()
  document.removeEventListener('keydown', jumpKeyCheck)
  document.addEventListener('keydown', jumpKeyCheck)
  document.removeEventListener('scroll', scrollCheck)
  document.addEventListener('scroll', scrollCheck)
}

async function hotkeyCheck(event) {
  try {
    options = await loadOptions()

    if (event.isComposite) {
      return
    }
    if (event.ctrlKey !== options.hotkeyCtrl) {
      return
    }
    if (event.shiftKey !== options.hotkeyShift) {
      return
    }
    if (event.altKey !== options.hotkeyAlt) {
      return
    }
    if (event.metaKey !== options.hotkeyMeta) {
      return
    }
    if (event.key.toUpperCase() !== options.hotkeyText.toUpperCase()) {
      return
    }
    if (isEnabled()) {
      disable()
    } else {
      enable()
    }
  } catch(ex) {
    console.error(ex)
  }
}

document.removeEventListener('keydown', hotkeyCheck)
document.addEventListener('keydown', hotkeyCheck)
