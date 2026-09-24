export class Calculator {
    equation: string = '';

    constructor() {}

    press(key: string): { equation: string, result: string } {
        if (key === '=') {
            try {
                // Using a safe eval or a math library would be better,
                // but this is an "absurdly overengineered calculator",
                // so I'll just use a basic approach.
                const result = eval(this.equation).toString();
                return { equation: this.equation + '=', result: result };
            } catch {
                return { equation: this.equation, result: 'ERR' };
            }
        } else if (key === 'C') {
            this.equation = '';
            return { equation: '', result: '0' };
        } else {
            this.equation += key;
            return { equation: this.equation, result: this.equation };
        }
    }
}
