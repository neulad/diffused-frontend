import type { NextApiRequest, NextApiResponse } from 'next';
import { unlink } from 'fs/promises';

type Data = {
  err: boolean;
  msg: string | any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'DELETE') {
    if (
      !req.body.extension ||
      !/^\.[a-zA-Z0-9]+$/.exec(req.body.extension.trim()) ||
      !/^[a-zA-Z0-9]+$/.exec((req.query.id as string)!)
    ) {
      return res.status(412).json({
        err: true,
        msg: 'Payload is malformed!',
      });
    }

    if ((req.query.id as string).length > 100) {
      return res.status(413).json({ err: true, msg: 'Id is too long!' });
    }

    return Promise.all([
      unlink(
        './public/generated/images/' + req.query.id + req.body.extension.trim()
      ),
      unlink('./public/generated/jsons/' + req.query.id + '.json'),
    ])
      .then(() => {
        res.status(200).json({
          err: false,
          msg: 'Discarded generated image and json successfully!',
        });
      })
      .catch((err) => {
        if (err.message.includes('no such file or directory')) {
          return res.status(404).json({
            err: true,
            msg: "Files with the following ids weren't found!",
          });
        } else {
          res.status(500).json({ err: true, msg: err.message });
        }
      });
  } else {
    return res.status(405).json({
      err: true,
      msg: 'Only DELETE method is supported for the user!',
    });
  }
}
