import { EVENT_RANK_CHANGED } from "../events.js"

export const postRankHandler = ({ rankEmitter }) => (req, res) => {
  console.log('Request body', req.body)

  const { lp, ml, mr, mrr, league_rank_number, fighter_name } = req.body

  rankEmitter.emit(EVENT_RANK_CHANGED, JSON.stringify({ fighter_name, lp, ml, mr, mrr, league_rank_number }))

  return res.json({
    status: 'ok',
    data: {
      fighter_name,
      lp,
      ml,
      mr,
      mrr,
      league_rank_number,
    }
  })
}
