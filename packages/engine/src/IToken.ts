export default interface IToken {
  kind: string;
  value: any;
  next: IToken | null;
}

