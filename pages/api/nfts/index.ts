import Replicate from 'replicate-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as fs from 'fs';
import * as https from 'https';
import { getToken } from 'next-auth/jwt';

interface GenerateParams {
  prompt: string;
  num_outputs: number;
  num_inference_steps: string | number;
  guidance_scale: string | number;
}

interface SaveJsonParams extends GenerateParams {
  address: string;
  image: string;
}

const replicate = new Replicate({
  token: process.env.NEXT_REPLICATE_TOKEN,
});

type Data = {
  err: boolean;
  msg: string | any;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      err: true,
      msg: 'Only POST method allowed!',
    });
  }
  const token = await getToken({ req });

  if (!token || !token.sub) {
    return res.status(403).json({ err: true, msg: 'You are not authorized!' });
  }

  const pokemonModel = await replicate.models.get('lambdal/text-to-pokemon');
  const generateParams: GenerateParams = {
    prompt: req.body.prompt ? req.body.prompt : '',
    num_outputs: 1,
    num_inference_steps: req.body.num_inference_steps
      ? req.body.num_inference_steps
      : 50,
    guidance_scale: req.body.guidance_scale ? req.body.guidance_scale : 7.5,
  };

  let rawImageUrl = await pokemonModel.predict(generateParams);

  if (!rawImageUrl) {
    return res.status(500).json({
      err: true,
      msg: "Couldn't retrieve the image, try again.",
    });
  } else {
    rawImageUrl = rawImageUrl[0];
  }

  const imageName = rawImageUrl.split('/')[4];
  const imageExtension = '.' + rawImageUrl.split('/')[5].split('.')[1];

  https.get(rawImageUrl, (imageResponse) => {
    const writeImageStream = fs.createWriteStream(
      `./public/generated/images/${imageName}` + imageExtension
    );

    imageResponse.pipe(writeImageStream);

    writeImageStream
      .on('error', (err) => {
        writeImageStream.close();
        console.error(err);
        res.status(500).json({ err: true, msg: err.message });
      })
      .on('finish', () => {
        writeImageStream.close();

        const saveJsonParams = {
          ...generateParams,
          address: token.sub || '',
          image: `/generated/images/${imageName}` + imageExtension,
        };

        writeJson(
          imageName,
          saveJsonParams,
          `./public/generated/images/${imageName}` + imageExtension,
          imageExtension,
          res
        );
      });
  });
}

function writeJson(
  id: string,
  saveJsonParams: SaveJsonParams,
  imagePath: string,
  imageExtension: string,
  res: NextApiResponse
) {
  fs.writeFile(
    `./public/generated/jsons/${id}.json`,
    JSON.stringify(saveJsonParams),
    (err) => {
      if (err) {
        console.error(`Error whilst writing json: ${err.message}`);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Error whilst deleting image: ${err.message}`);
          }

          return res.status(500).json({
            err: true,
            msg: "Couldn't save metadata, generation declined",
          });
        });

        return;
      }

      res.status(200).json({
        err: false,
        msg: { id, extension: imageExtension },
      });
    }
  );
}
