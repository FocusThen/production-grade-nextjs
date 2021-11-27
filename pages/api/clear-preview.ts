import { NextApiResponse } from 'next'

export default (req, res: NextApiResponse) => {
  res.clearPreviewData()
  res.redirect('preview mode disabled')
}
