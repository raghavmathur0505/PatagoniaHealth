import * as HttpStatus from 'http-status-codes';

/**
 * This function is the default read route handler for the microservice.
 * @param {Request} req the express request {@link http://expressjs.com/en/api.html#req}
 * @param {Response} res the express response {@link http://expressjs.com/en/api.html#res}
 * @param {Function} next the 'next' function to call in the handler chain
 * @throws GPError
 */
// eslint-disable-next-line no-unused-vars, consistent-return
export default async function readHandler(req, res, next) {
  // Set additional allowed fields & paging for this resource type
  const allowedFields = ['name'];

  const { Patient } = req.models;

  // Create the search object
  const search = req.query;
  console.log('search', search);

  try {
    // Fetch the records
    const data = await Patient.find(search);

    return res
      .status(HttpStatus.OK)
      .json(data);
  } catch (err) {

    return next(err);
  }
}
