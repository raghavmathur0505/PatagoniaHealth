import * as jsonpatch from 'fast-json-patch';
import * as HttpStatus from 'http-status-codes';
import _ from 'lodash';


/**
 * This function is the default update route handler for the microservice.
 * @param {Request} req the express request {@link http://expressjs.com/en/api.html#req}
 * @param {Response} res the express response {@link http://expressjs.com/en/api.html#res}
 * @param {Function} next the 'next' function to call in the handler chain
 * @throws GPError
 */
// eslint-disable-next-line no-unused-vars
export default async function updateByIdHandler(req, res, next) {
  const { Physician } = req.models;

  // If we passed validation, sanitize the patch items
  const patch = req.body.patch;
  const id = req.params[0];
  try {
    let resource = await Physician.findOne({ id });
    // If object doesn't exist, pass 404 along chain
    if (resource === null) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({
          Error: 'Resource Not Found',
        });
    }

    // eslint-disable-next-line no-param-reassign
    resource = jsonpatch.applyPatch(resource, patch).newDocument;

    try {
      await resource.save();
    } catch (err) /* istanbul ignore next */ {
      throw new Error(err.message);
    }

    return res
      .status(HttpStatus.OK)
      .json(resource);
  } catch (err) {
    return next(err);
  }
}
