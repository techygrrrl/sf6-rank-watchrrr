const selectors = {
  rankImage: 'js-rank-image',
  username: 'js-username',
  progress: 'js-progress',
  lp: 'js-lp',
  goalLp: 'js-goal-lp',
  mrElement: 'js-mr',
}

let rankImageElement = null
let usernameElement = null
let progressElement = null
let lpElement = null
let goalLpElement = null
let mrElement = null

document.addEventListener('DOMContentLoaded', () => {
  perform()
})


function perform() {
  rankImageElement = document.getElementById(selectors.rankImage)
  if (!rankImageElement) throw new Error('Missing rankImageElement')

  usernameElement = document.getElementById(selectors.username)
  if (!usernameElement) throw new Error('Missing usernameElement')

  progressElement = document.getElementById(selectors.progress)
  if (!progressElement) throw new Error('Missing progressElement')

  lpElement = document.getElementById(selectors.lp)
  if (!lpElement) throw new Error('Missing lpElement')

  goalLpElement = document.getElementById(selectors.goalLp)
  if (!goalLpElement) throw new Error('Missing goalLpElement')

  mrElement = document.getElementById(selectors.mrElement)
  if (!mrElement) throw new Error('Missing mrElement')

  // console.log('All elements OK')

  listenForRankUpdates()
}


function getConfig() {
  const params = new URLSearchParams(window.location.search)

  /////////////////
  // Host
  /////////////////
  const host = decodeURIComponent(params.get('host') || 'localhost%3A55743')
  const mode = params.get('mode') || 'ws' // 'ws' | 'kv'
  const token = params.get('token')
  const id = params.get('id')

  return {
    id,
    host,
    mode,
    token,
  }
}

function listenForRankUpdates() {
  const { mode } = getConfig()

  switch (mode) {
    case 'ws':
      return listenForRankUpdatesWithWebSockets()
    case 'kv':
      return listenForRankUpdatesWithLongPolling()
  }
}

function listenForRankUpdatesWithLongPolling() {
  const { host, token, id } = getConfig()

  const endpoint = `${host}/api/get`
  const refreshInterval = 120 * 1000

  const fetchPlayerData = () => {
    window.fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ key: 'sf6-rank-watchrrr-' + id })
    })
    .then((res) => {
      return res.json()
    })
    .then((playerData) => {
      if (!playerData || !playerData.value) {
        console.error('no player data')
        return
      }

      try {
        const data = JSON.parse(playerData.value)
        updateRankData(data)
      } catch (e) {
        console.error(e)
      }
    })
    .catch(e => {
      console.error('fetch error', e)
    })
  }

  fetchPlayerData()

  setInterval(() => {
    fetchPlayerData()
  }, refreshInterval)
}

function listenForRankUpdatesWithWebSockets() {
  const { host } = getConfig()
  const socket = new WebSocket(`ws://${host}`)

  socket.addEventListener('open', () => {
    console.log('Connected to server')
  })

  socket.addEventListener('message', (message) => {
    const { data } = JSON.parse(message.data)
    console.log('Got data', data)

    updateRankData(data)
  })
}

function updateRankData(data) {
  // Add username
  usernameElement.innerText = data.fighter_name

  // Add image
  const imageSrc = `images/${getRankImageName(data)}`
  rankImageElement.src = imageSrc

  // Add LP
  const nextRankLp = getNextRankLP(data.lp)
  const prevRankLp = getPreviousRankLP(data.lp)

  // Add MR and if we have MR, hide the goal LP since it's not relevant
  if (data.mr) {
    goalLpElement.style.display = 'none'
    mrElement.style.display = 'block'
  } else {
    goalLpElement.style.display = 'block'
    mrElement.style.display = 'none'
  }

  mrElement.innerText = `${data.mr} MR`
  lpElement.innerText = data.lp
  goalLpElement.innerText = nextRankLp

  // Progress
  const percentage = calculatePercentage({
    startLp: prevRankLp,
    currentLp: data.lp,
    goalLp: nextRankLp
  })
  // console.log('percentage', percentage)
  progressElement.style.width = percentage + '%'
}

function calculatePercentage({ startLp, currentLp, goalLp }) {
  // return parseInt((currentLp / goalLp) * 100)

  // console.log({ startLp, goalLp, currentLp })
  const startOffest =  currentLp - startLp
  const goalOffset = goalLp - startLp

  // console.log({ startOffest, goalOffset, currentLp })
  // console.log('division', startOffest / goalOffset)

  return parseInt((startOffest / goalOffset) * 100)
}


function getRankImageName(data) {
  const suffix = data.ml || data.league_rank_number
  return `rank${suffix}_s.png`
}

const rankLevels = [
  200, 400, 600, 800,
  1000, 1400, 1800, 2200, 2600,
  3000, 3400, 3800, 4200, 4600,
  5000, 5800, 6600, 7400, 8200,
  9000, 9800, 10600, 11400, 12200,
  13000, 14200, 15400, 16600, 17800,
  19000, 20200, 21400, 22600, 23800,
]

function getNextRankLP(lp) {
  const rankLevelsCopy = JSON.parse(JSON.stringify(rankLevels))
  for (level of rankLevelsCopy) {
    if (lp < level) {
      // console.log('getNextRankLP - doing level', level)
      return level
    }
  }

  return 25000
}

function getPreviousRankLP(lp) {
  const rankLevelsCopy = JSON.parse(JSON.stringify(rankLevels)).reverse()
  for (level of rankLevelsCopy) {
    if (lp >= level) {
      // console.log('getPreviousRankLP  - doing level', level)
      return level
    }
  }

  return 0
}
