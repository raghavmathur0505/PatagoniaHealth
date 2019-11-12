import * as HttpStatus from 'http-status-codes';

/**
 * This function is the default read route handler for the microservice.
 * @param {Request} req the express request {@link http://expressjs.com/en/api.html#req}
 * @param {Response} res the express response {@link http://expressjs.com/en/api.html#res}
 * @param {Function} next the 'next' function to call in the handler chain
 * @throws GPError
 */
// eslint-disable-next-line no-unused-vars
export default async function readByIdHandler(req, res, next) {
  const { Physician } = req.models;
  const id = req.params[0];

  try {
    const resource = await Physician.findOne({ id });

    if (resource === null) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({
          Error: 'Resource Not Found',
        });
    }

    return res
      .status(HttpStatus.OK)
      .json(resource);
  } catch (err) {
    return next(err);
  }
}
