import { Schema } from 'mongoose';
import uuid4 from 'uuid4';
import uniqueValidator from 'mongoose-unique-validator';
import _ from 'lodash';


const transform = (doc, ret) => {
  /* eslint-disable no-param-reassign, no-underscore-dangle */
  delete ret._id;
  delete ret.__v;
  /* eslint-enable no-param-reassign, no-underscore-dangle */
};

// Create the resource schema
const patientSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: uuid4,
  },

  resource: {
    type: String,
    default: 'Patient',
  },

  metadata: {
    lastUpdated: {
      type: Date,
      required: true,
      default: Date.now,
    },

    version: {
      type: String,
      required: true,
      default: '1.0.0',
    },
  },

  // Add your resource-specific fields below; example 'name' field provided
  firstname: {
    type: String,
    required: true,
    match: [/^[a-zA-Z\s]*$/, 'is invalid. Expects Letters and Spaces.'],
  },

  lastname: {
    type: String,
    required: true,
    match: [/^[a-zA-Z\s]*$/, 'is invalid. Expects Letters and Spaces.'],
  },

  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid. Format: xxx@yyy.zzz'],
  },

  physician: {
    type: String,
  }
}, {
  collection: 'Patient',

  timestamps: {
    createdAt: 'metadata.createdAt',
    updatedAt: 'metadata.lastUpdated',
  },

  toObject: { transform },
  toJSON: { transform },
});

// Add the text search index
patientSchema.index({
  name: 'text',
  // Add other fields for compound text search
});

// Add uniqueValidator plugin
patientSchema.plugin(uniqueValidator);


export default patientSchema;
