// A small, safe recursive-descent parser/evaluator for calculator expressions.
// Supports: + - * / ^ % parentheses, unary minus, functions (sin,cos,tan,log,ln,sqrt),
// and constants (pi, e). Degree mode converts trig function inputs from degrees.

type Mode = 'deg' | 'rad';

const FUNCTIONS: Record<string, (x: number, mode: Mode) => number> = {
  sin: (x, mode) => Math.sin(mode === 'deg' ? (x * Math.PI) / 180 : x),
  cos: (x, mode) => Math.cos(mode === 'deg' ? (x * Math.PI) / 180 : x),
  tan: (x, mode) => Math.tan(mode === 'deg' ? (x * Math.PI) / 180 : x),
  asin: (x, mode) => (mode === 'deg' ? (Math.asin(x) * 180) / Math.PI : Math.asin(x)),
  acos: (x, mode) => (mode === 'deg' ? (Math.acos(x) * 180) / Math.PI : Math.acos(x)),
  atan: (x, mode) => (mode === 'deg' ? (Math.atan(x) * 180) / Math.PI : Math.atan(x)),
  log: (x) => Math.log10(x),
  ln: (x) => Math.log(x),
  sqrt: (x) => Math.sqrt(x),
  abs: (x) => Math.abs(x),
};

class Parser {
  pos = 0;
  expr: string;
  mode: Mode;

  constructor(expr: string, mode: Mode) {
    this.expr = expr;
    this.mode = mode;
  }

  peek(): string {
    return this.expr[this.pos];
  }

  eatSpaces() {
    while (this.peek() === ' ') this.pos++;
  }

  parseExpression(): number {
    let value = this.parseTerm();
    this.eatSpaces();
    while (this.peek() === '+' || this.peek() === '-') {
      const op = this.expr[this.pos++];
      const rhs = this.parseTerm();
      value = op === '+' ? value + rhs : value - rhs;
      this.eatSpaces();
    }
    return value;
  }

  parseTerm(): number {
    let value = this.parseFactor();
    this.eatSpaces();
    while (this.peek() === '*' || this.peek() === '/' || this.peek() === '%') {
      const op = this.expr[this.pos++];
      const rhs = this.parseFactor();
      if (op === '*') value *= rhs;
      else if (op === '/') value /= rhs;
      else value %= rhs;
      this.eatSpaces();
    }
    return value;
  }

  parseFactor(): number {
    let value = this.parseUnary();
    this.eatSpaces();
    while (this.peek() === '^') {
      this.pos++;
      const rhs = this.parseUnary();
      value = Math.pow(value, rhs);
      this.eatSpaces();
    }
    return value;
  }

  parseUnary(): number {
    this.eatSpaces();
    if (this.peek() === '-') {
      this.pos++;
      return -this.parseUnary();
    }
    if (this.peek() === '+') {
      this.pos++;
      return this.parseUnary();
    }
    return this.parsePostfix();
  }

  parsePostfix(): number {
    let value = this.parsePrimary();
    this.eatSpaces();
    while (this.peek() === '!') {
      this.pos++;
      let result = 1;
      for (let i = 2; i <= value; i++) result *= i;
      value = value <= 1 ? 1 : result;
      this.eatSpaces();
    }
    return value;
  }

  parsePrimary(): number {
    this.eatSpaces();
    if (this.peek() === '(') {
      this.pos++;
      const value = this.parseExpression();
      this.eatSpaces();
      if (this.peek() === ')') this.pos++;
      return value;
    }

    const funcMatch = /^[a-zA-Z]+/.exec(this.expr.slice(this.pos));
    if (funcMatch) {
      const name = funcMatch[0];
      if (name === 'pi') {
        this.pos += 2;
        return Math.PI;
      }
      if (name === 'e' && this.expr[this.pos + 1] !== '^') {
        this.pos += 1;
        return Math.E;
      }
      if (FUNCTIONS[name]) {
        this.pos += name.length;
        this.eatSpaces();
        if (this.peek() === '(') {
          this.pos++;
          const arg = this.parseExpression();
          this.eatSpaces();
          if (this.peek() === ')') this.pos++;
          return FUNCTIONS[name](arg, this.mode);
        }
      }
    }

    const numMatch = /^\d+(\.\d+)?/.exec(this.expr.slice(this.pos));
    if (numMatch) {
      this.pos += numMatch[0].length;
      return parseFloat(numMatch[0]);
    }

    throw new Error('Unexpected token at ' + this.pos);
  }
}

export function evaluateExpression(expr: string, mode: Mode = 'deg'): number {
  const cleaned = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/π/g, 'pi');
  const parser = new Parser(cleaned, mode);
  const result = parser.parseExpression();
  if (Number.isNaN(result) || !Number.isFinite(result)) throw new Error('Invalid result');
  return result;
}
