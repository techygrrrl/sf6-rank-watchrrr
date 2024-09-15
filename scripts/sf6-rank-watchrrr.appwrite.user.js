// ==UserScript==
// @name        [AppWrite] Watch the rank for a Street Fighter 6 profile
// @match       https://www.streetfighter.com/6/buckler/api/en/card/*
// @grant       none
// @version     1.0
// @author      -
// @description https://github.com/techygrrrl/sf6-rank-watchrrr
// @require     https://cdn.jsdelivr.net/npm/appwrite@16.0.0
// ==/UserScript==

;(() => {
  perform()

  const tag = 'sf6-rank-watchrrr'

  async function perform() {
    const playerId = location.href
      .split('https://www.streetfighter.com/6/buckler/api/en/card/')[1]
      ?.replace(/[^\d.-]+/g, '')

    const { databaseId, collectionId, projectId } = getConfig()
    if (!databaseId || !collectionId || !projectId) {
      throw new Error('Script misconfigured.')
    }

    const { Client, Databases } = Appwrite
    const client = new Client()

    client.setEndpoint('https://cloud.appwrite.io/v1').setProject(projectId)

    const databases = new Databases(client)

    const listResult = await databases.listDocuments(
      databaseId,
      collectionId,
      []
    )

    const document = listResult.documents.find((doc) => doc.sid == playerId)

    const playerData = getPlayerData()

    try {
      const recordResult = await databases[
        document ? 'updateDocument' : 'createDocument'
      ](databaseId, collectionId, playerId, {
        sid: playerId,
        data: JSON.stringify(playerData),
      })

      console.log(tag, 'Successfully updated record', recordResult)
      delayWindowRefresh()
    } catch (err) {
      console.error(tag, 'Failed to create or update record', err)
    }
  }

  function getConfig() {
    /////////////////
    // Refresh time
    /////////////////
    const minRefreshTime = 30 // Refresh responsibly (minimum time is 1 refresh every 30 seconds)
    const refreshTimeString = localStorage.getItem('refresh_time') || '120' // default: 2 mins
    let refresh = parseInt(refreshTimeString)
    if (isNaN(refresh)) {
      refresh = 120
    }
    refresh = Math.max(minRefreshTime, refresh)

    /////////////////
    // AppWrite Project ID
    /////////////////
    const projectId = localStorage.getItem('appwrite_project_id')
    if (!projectId) {
      throw new Error(
        'user script misconfigured. missing: appwrite_project_id '
      )
    }

    /////////////////
    // AppWrite Database ID
    /////////////////
    const databaseId = localStorage.getItem('appwrite_database_id')
    if (!databaseId) {
      throw new Error(
        'user script misconfigured. missing: appwrite_database_id '
      )
    }

    /////////////////
    // AppWrite Collection ID
    /////////////////
    const collectionId = localStorage.getItem('appwrite_collection_id')
    if (!collectionId) {
      throw new Error(
        'user script misconfigured. missing: appwrite_collection_id '
      )
    }

    return {
      refresh,
      projectId,
      databaseId,
      collectionId,
    }
  }

  function getPlayerData() {
    return JSON.parse(document.body.innerText)
  }

  function delayWindowRefresh() {
    const config = getConfig()

    setTimeout(() => {
      console.log(tag, 'Refreshing...')
      window.location.reload()
    }, config.refresh * 1000)
  }
})()
