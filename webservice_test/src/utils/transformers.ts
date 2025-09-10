import { ValueTransformer } from "typeorm";


// Transformer para converter string para number
export const decimalTransformer: ValueTransformer = {
    to: (value: number): number => value,
    from: (value: string): number => parseFloat(value)
};