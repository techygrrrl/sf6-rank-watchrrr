export const getRankHandler = ({ RANK_DATA }) => (req, res) => {
  return res.json({
    data: RANK_DATA
  })
}
