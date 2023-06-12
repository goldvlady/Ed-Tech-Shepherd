import { Schema, model } from 'mongoose';

import { Entity } from '../../types';

export interface Level extends Entity {
  label: string;
}

const schema = new Schema<Level>({
  label: { type: String, required: true },
});

export default model<Level>('Level', schema);
