import SpreadSheet from "@equals-demo/engine";
import { executeRemoteFunction } from "./api";

const registerFunctions = (sheet: SpreadSheet) => {
  sheet.engine.registerFunction('QUERY', (stack: any[]) => {
    const remoteStack = [];
    remoteStack.push(stack.shift());
    remoteStack.push(stack.shift());
    return executeRemoteFunction('QUERY', remoteStack);
  });
}

export default registerFunctions;
