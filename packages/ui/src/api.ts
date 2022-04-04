import store from '@jitcoder/usestore';
import axios from 'axios';
import SpreadSheet, { ICell } from '@equals-demo/engine';
import registerFunctions from './register-functions';

export const loadSheet = async () => {
  const resp = await axios.get<ICell[]>('/api');

  const sheet = await SpreadSheet.fromJSON(resp.data, registerFunctions);
  store.set('app.sheet', sheet);
}

export const updateCell = async (key: string, value: any) => {
  const sheet = store.get('app.sheet') as SpreadSheet;

  await Promise.all([
    sheet.setCell(key, value),
    axios.put(`/api/${key}`, { value })
  ]);

  store.set('app.sheet', sheet);
}

export const executeRemoteFunction = async (name: string, stack: any[]) => {

  try {
    const resp = await axios.post(`/api/function/${name}`, stack);
    const { result } = resp.data;
    return result;
  } catch (e) {
    console.error(e);
    return null;
  }

}