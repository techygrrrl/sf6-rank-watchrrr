import { RANK_DATA } from "../data.js"
import { EVENT_RANK_CHANGED } from "../events.js"

export const webSocketConnectionHandler = ({ rankEmitter }) => (ws) => {
  ws.on('error', console.error)

  ws.on('message', function message(data) {
    console.log('received: %s', data)
  })

  ws.send(JSON.stringify({ data: RANK_DATA }, null, 2))

  rankEmitter.on(EVENT_RANK_CHANGED, (data) => {
    const {
      fighter_name,
      league_rank_number,
      lp,
      ml,
      mr,
      mrr,
    } = JSON.parse(data)

    // Update the data
    RANK_DATA.fighter_name = fighter_name
    RANK_DATA.lp = lp
    RANK_DATA.ml = ml
    RANK_DATA.mr = mr
    RANK_DATA.mrr = mrr
    RANK_DATA.league_rank_number = league_rank_number

    ws.send(JSON.stringify({ data: RANK_DATA }, null, 2))
  })
}
