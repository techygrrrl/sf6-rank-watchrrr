// ==UserScript==
// @name        Watch the rank (including LP) for a Street Fighter 6 profile (kv-server version)
// @match       https://www.streetfighter.com/6/buckler/api/en/card/*
// @grant       none
// @version     1.0
// @author      -
// @description https://github.com/techygrrrl/sf6-rank-watchrrr
// ==/UserScript==

perform()

function getConfig() {
  /////////////////
  // Refresh time
  /////////////////
  const minRefreshTime = 60 // Refresh responsibly (minimum time is 1 refresh per minute)
  const refreshTimeString = localStorage.getItem('refresh-time') || '120' // default: 2 mins
  let refresh = parseInt(refreshTimeString)
  if (isNaN(refresh)) {
    refresh = 120
  }
  refresh = Math.max(minRefreshTime, refresh)

  /////////////////
  // Host
  /////////////////

  let kvServer = localStorage.getItem('kv-server')
  if (!kvServer) {
    console.error('[error] localStorage "kv-server" not set.')
  }

  const kvToken = localStorage.getItem('kv-token')
  if (!kvToken) {
    console.error('[error] localStorage "kv-token" not set.')
  }

  return {
    refresh,
    kvServer,
    kvToken,
  }
}

function kvKeyForPlayerData(playerData) {
  return 'sf6-rank-watchrrr-' + playerData.sid
}

function perform() {
  const { kvServer, kvToken, refresh } = getConfig()
  if (!kvServer || !kvToken) {
    return
  }

  const playerData = getPlayerData()

  window
    .fetch(`${kvServer}/api/set`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${kvToken}`,
      },
      body: JSON.stringify({
        key: kvKeyForPlayerData(playerData),
        value: JSON.stringify(playerData)
      })
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
