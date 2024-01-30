const selectors = {
  rankImage: 'js-rank-image',
  username: 'js-username',
  progress: 'js-progress',
  lp: 'js-lp',
  goalLp: 'js-goal-lp',
}

let rankImageElement = null
let usernameElement = null
let progressElement = null
let lpElement = null
let goalLpElement = null

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

  // console.log('All elements OK')

  listenForRankUpdates()
}


function getConfig() {
  const params = new URLSearchParams(window.location.search)

  /////////////////
  // Host
  /////////////////
  const host = decodeURIComponent(params.get('host') || 'localhost%3A55743')

  return {
    host,
  }
}

function listenForRankUpdates() {
  const { host } = getConfig()
  const socket = new WebSocket(`ws://${host}`)

  socket.addEventListener('open', () => {
    console.log('Connected to server')
  })

  socket.addEventListener('message', (message) => {
    const { data } = JSON.parse(message.data)
    console.log('Got data', data)

    // Add username
    usernameElement.innerText = data.fighter_name

    // Add image
    const imageSrc = `images/${getRankImageName(data.lp)}`
    rankImageElement.src = imageSrc

    // Add LP
    const nextRankLp = getNextRankLP(data.lp)
    const prevRankLp = getPreviousRankLP(data.lp)

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
  })
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


/**
 *
 * @param {integer} lp
 * @returns { name: string, level: integer }
 */
function getRank(lp) {
  // Master
  if (lp >= 25000) {
    let level = -1

    return {
      name: 'master',
      level,
    }
  }

  // Diamond
  if (lp >= 19000) {
    let level = 1
    if (lp >= 23800) level = 5
    if (lp >= 22600) level = 4
    if (lp >= 21400) level = 3
    if (lp >= 20200) level = 2

    return {
      name: 'diamond',
      level,
    }
  }

  // Platinum
  if (lp >= 13000) {
    let level = 1
    if (lp >= 17800) level = 5
    if (lp >= 16600) level = 4
    if (lp >= 15400) level = 3
    if (lp >= 14200) level = 2

    return {
      name: 'platinum',
      level,
    }
  }

  // Gold
  if (lp >= 9000) {
    let level = 1
    if (lp >= 12200) level = 5
    if (lp >= 11400) level = 4
    if (lp >= 10600) level = 3
    if (lp >= 9800) level = 2

    return {
      name: 'gold',
      level,
    }
  }

  // Silver
  if (lp >= 5000) {
    let level = 1
    if (lp >= 8200) level = 5
    if (lp >= 7400) level = 4
    if (lp >= 6600) level = 3
    if (lp >= 5800) level = 2

    return {
      name: 'silver',
      level,
    }
  }

  // Bronze
  if (lp >= 3000) {
    let level = 1
    if (lp >= 4600) level = 5
    if (lp >= 4200) level = 4
    if (lp >= 3800) level = 3
    if (lp >= 3400) level = 2

    return {
      name: 'bronze',
      level,
    }
  }

  // Iron
  if (lp >= 1000) {
    let level = 1
    if (lp >= 2600) level = 5
    if (lp >= 2200) level = 4
    if (lp >= 1800) level = 3
    if (lp >= 1400) level = 2

    return {
      name: 'iron',
      level,
    }
  }

  // Rookie
  let level = 1
  if (lp >= 800) level = 5
  if (lp >= 600) level = 4
  if (lp >= 400) level = 3
  if (lp >= 200) level = 2

  return {
    name: 'rookie',
    level,
  }
}


function _getRankImageSuffix(lp) {
  // Master
  if (lp >= 25000) return 36

  // Diamond
  if (lp >= 19000) {
    let level = 31
    if (lp >= 23800) return 35
    if (lp >= 22600) return 34
    if (lp >= 21400) return 33
    if (lp >= 20200) return 32

    return level
  }

  // Platinum
  if (lp >= 13000) {
    let level = 26
    if (lp >= 17800) return 30
    if (lp >= 16600) return 29
    if (lp >= 15400) return 28
    if (lp >= 14200) return 27

    return level
  }

  // Gold
  if (lp >= 9000) {
    if (lp >= 12200) return 25
    if (lp >= 11400) return 24
    if (lp >= 10600) return 23
    if (lp >= 9800) return 22

    return 21
  }

  // Silver
  if (lp >= 5000) {
    if (lp >= 8200) return 20
    if (lp >= 7400) return 19
    if (lp >= 6600) return 18
    if (lp >= 5800) return 17

    return 16
  }

  // Bronze
  if (lp >= 3000) {
    if (lp >= 4600) return 15
    if (lp >= 4200) return 14
    if (lp >= 3800) return 13
    if (lp >= 3400) return 12

    return 11
  }

  // Iron
  if (lp >= 1000) {
    if (lp >= 2600) return 10
    if (lp >= 2200) return 9
    if (lp >= 1800) return 8
    if (lp >= 1400) return 7

    return 6
  }

  // Rookie
  if (lp >= 800) return 5
  if (lp >= 600) return 4
  if (lp >= 400) return 3
  if (lp >= 200) return 2

  return 1
}

function getRankImageName(lp) {
  const suffix = _getRankImageSuffix(lp)
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
