import { AbstractControlOpts } from '.';

export type FormOpts = Exclude<AbstractControlOpts, 'type'>;
