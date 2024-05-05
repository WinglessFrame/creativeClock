const formatMoneyInput = (input: string | number) =>
  parseFloat(input.toString()).toFixed(2);

export default formatMoneyInput;
