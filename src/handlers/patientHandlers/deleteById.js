import * as HttpStatus from 'http-status-codes';

/**
 * This function is the default delete route handler for the microservice.
 * @param {Request} req the express request {@link http://expressjs.com/en/api.html#req}
 * @param {Response} res the express response {@link http://expressjs.com/en/api.html#res}
 * @param {Function} next the 'next' function to call in the handler chain
 * @throws GPError
 */
// eslint-disable-next-line no-unused-vars
export default async function deleteByIdHandler(req, res, next) {
  try {
    const { Patient } = req.models;
    const id = req.params[0];
    const resource = await Patient.findOne({ id });
    // 404 if the object doesn't exist (or was already soft-deleted)
    if (resource === null) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send({
          Error: 'Resource Not Found',
        });
    }

    await Patient.findOneAndRemove({ id });

    // If there were no errors, send success message
    return res
      .status(HttpStatus.OK)
      .send();
  } catch (err) {
    return next(err);
  }
}
