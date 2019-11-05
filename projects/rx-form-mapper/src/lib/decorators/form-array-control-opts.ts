import { AbstractControlOpts } from '.';

export type FormArrayOpts = AbstractControlOpts & Required<Pick<AbstractControlOpts, 'type'>>;
