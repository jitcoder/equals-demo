
import { Engine } from '@equals-demo/engine';

import { query } from './query.js';

const registerFunctions = (engine: Engine) => {
  engine.registerFunction('QUERY', query);
};

export default registerFunctions;
