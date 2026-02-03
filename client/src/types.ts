export interface Ingredient {
    name: string;
    amount: number | string;
    unit: string;
}

export interface Instruction {
    step_number: number;
    instruction_text: string;
}

export interface Recipe {
    id?: number;
    title: string;
    cooking_time_minutes: number;
    servings: number;
    image_url?: string;
    rating?: number;
    source_url?: string;
    notes?: string;
    ingredients: Ingredient[];
    instructions: Instruction[];
    tags: string[];
    created_at?: string;
    in_roster?: boolean;
}