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
  const { Patient } = req.models;

  // If we passed validation, sanitize the patch items
  const patch = req.body.patch;
  const id = req.params[0];
  console.log('id', id);
  try {
    let resource = await Patient.findOne({ id });
    console.log('resource', resource);
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
    console.log('resource-2', resource);
    try {
      await resource.save();
    } catch (err) /* istanbul ignore next */ {
      console.log('err', err);
      throw new Error(err.message);
    }

    return res
      .status(HttpStatus.OK)
      .json(resource);
  } catch (err) {
    console.log('err.2 : ', err);
    return next(err);
  }
}
