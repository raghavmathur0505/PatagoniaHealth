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
const physicianSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    default: uuid4,
  },

  resource: {
    type: String,
    default: 'Physician',
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

  username: {
    type: String,
    required: true,
    index: true,
    unique: true,
    match: [/\S+@\S+\.\S+/, 'is invalid. Format: xxx@yyy.zzz'],
  },

  password: {
    type: String,
    required: true,
  },

  password2: {
    type: String,
    required: true,
  },
}, {
  collection: 'Physician',

  timestamps: {
    createdAt: 'metadata.createdAt',
    updatedAt: 'metadata.lastUpdated',
  },

  toObject: { transform },
  toJSON: { transform },
});

// Add the text search index
physicianSchema.index({
  name: 'text',
  // Add other fields for compound text search
});

// Add uniqueValidator plugin
physicianSchema.plugin(uniqueValidator);

export default physicianSchema;
