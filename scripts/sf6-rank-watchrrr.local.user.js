// ==UserScript==
// @name        Watch the rank (including LP) for a Street Fighter 6 profile
// @match       https://www.streetfighter.com/6/buckler/api/en/card/*
// @grant       none
// @version     1.0
// @author      -
// @description https://github.com/techygrrrl/sf6-rank-watchrrr
// ==/UserScript==

perform()

function getConfig() {
  const params = new URLSearchParams(window.location.search)

  /////////////////
  // Refresh time
  /////////////////
  const minRefreshTime = 60 // Refresh responsibly (minimum time is 1 refresh per minute)
  const refreshTimeString = params.get('refresh_time') || '120' // default: 2 mins
  let refresh = parseInt(refreshTimeString)
  if (isNaN(refresh)) {
    refresh = 120
  }
  refresh = Math.max(minRefreshTime, refresh)

  /////////////////
  // Host
  /////////////////
  const host = decodeURIComponent(params.get('host') || 'localhost%3A55743')

  return {
    refresh,
    host,
  }
}

function perform() {
  const config = getConfig()
  // console.log('Config', config)

  const playerData = getPlayerData()

  window
    .fetch(`http://${config.host}/rank`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerData)
    })
    .then((res) => {
      return res.json()
    })
    .catch(e => {
      console.error('fetch error', e)
    })
    .finally(() => {
      delayWindowRefresh()
    })
}


function getPlayerData() {
  return JSON.parse(document.body.innerText)
}

function delayWindowRefresh() {
  const config = getConfig()

  setTimeout(() => {
    console.log('Refreshing...')
    window.location.reload()
  }, config.refresh * 1000)
}
