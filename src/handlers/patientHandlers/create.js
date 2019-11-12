import * as HttpStatus from 'http-status-codes';
/**
 * This function is the default create route handler for the microservice.
 * @param {Request} req the express request {@link http://expressjs.com/en/api.html#req}
 * @param {Response} req the express request {@link http://expressjs.com/en/api.html#res}
 * @param {Function} next the 'next' function to call in the handler chain
 * @throws GPError
 */
// eslint-disable-next-line no-unused-vars
export default async function createHandler(req, res, next) {
  const { Patient } = req.models;

  const data = req.body;

  const resource = new Patient(Object.assign({ resource: 'Patient' }, data));

  try {
    const resourceData = await resource.save();

    return res
      .status(HttpStatus.CREATED)
      .set('Location', `${req.protocol}://${req.get('host')}${req.originalUrl}/${resourceData.id}`)
      .json(resourceData);
  } catch (err) {
    return next(err);
  }
}
