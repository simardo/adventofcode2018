console.log('DAY 14');

type Recipe = {
    score: number;
    next?: Recipe;
    active: boolean;
}

function combineRecipes(r1: Recipe, r2: Recipe): Recipe[] {
    const score: number = r1.score + r2.score;

    const scoreV: number[] = [...score.toString()].map(s => Number.parseInt(s));

    const result: Recipe[] = [];
    scoreV.forEach(s => {
        const newRecipe: Recipe = { score: s, active: true };
        const last: number = result.push(newRecipe) - 2;

        if (last >= 0) {
            result[last].next = newRecipe;
        }
    })

    return result;
}

function toString(recipe: Recipe): string {
    const s: number[] = [];

    let r: Recipe = recipe;
    do {
        s.push(r.score);
        r = r.next!;
    } while (r != recipe);

    return s.join(' ');
}

// PART 1
console.log(doPart1(0));

export function doPart1(input: number): string {
    const recipe1: Recipe = { score: 3, active: true };
    const recipe2: Recipe = { score: 7, active: true };

    recipe1.next = recipe2;
    recipe2.next = recipe1;

    let lastRecipe: Recipe = recipe2;

    let elf1: Recipe = recipe1;
    let elf2: Recipe = recipe2;

    let count: number = 2;
    while (count < input + 10) {
        const newRecipes: Recipe[] = combineRecipes(elf1, elf2);
        count += newRecipes.length;

        lastRecipe.next = newRecipes[0];
        lastRecipe = newRecipes[newRecipes.length - 1];
        lastRecipe.next = recipe1;

        const e1: number = elf1.score + 1;
        for (let e: number = 1; e <= e1; e++) {
            elf1 = elf1.next!;
        }

        const e2: number = elf2.score + 1;
        for (let e: number = 1; e <= e2; e++) {
            elf2 = elf2.next!;
        }
    }

    let current: Recipe = recipe1;
    for (let i = 1; i <= input; i++) {
        current = current.next!;
    }

    let result: string[] = [];
    for (let i = 1; i <= 10; i++) {
        result.push(current.score.toString());
        current = current.next!;
    }

    return result.join('');
}

// PART 2
console.log(doPart2(0));

export function doPart2(input: number): number {
    const inputV: number[] = [...input.toString()].map(s => Number.parseInt(s));
    console.log(inputV);

    const recipe1: Recipe = { score: 3, active: true };
    const recipe2: Recipe = { score: 7, active: true };

    recipe1.next = recipe2;
    recipe2.next = recipe1;

    let lastRecipe: Recipe = recipe2;

    let elf1: Recipe = recipe1;
    let elf2: Recipe = recipe2;

    let completed: boolean = false;
    let mark: Recipe | undefined = undefined;
    let restart: Recipe = recipe1;
    while (!completed) {
        const newRecipes: Recipe[] = combineRecipes(elf1, elf2);

        lastRecipe.next = newRecipes[0];
        lastRecipe = newRecipes[newRecipes.length - 1];
        lastRecipe.next = recipe1;

        const e1: number = elf1.score + 1;
        for (let e: number = 1; e <= e1; e++) {
            elf1 = elf1.next!;
        }

        const e2: number = elf2.score + 1;
        for (let e: number = 1; e <= e2; e++) {
            elf2 = elf2.next!;
        }

        let current: Recipe = restart;
        let index: number = 0;
        do {
            if (current.score === inputV[index]) {
                if (index === 0) {
                    mark = current;
                }
                index++;
            } else if (index < inputV.length) {
                if (mark !== undefined) {
                    restart = mark;
                }
                mark = undefined;
                index = 0;
            }

            current = current.next!;
        } while (current !== recipe1);

        if (index < inputV.length) {
            if (mark !== undefined) {
                restart = mark;
            }
            mark = undefined;
        }

        completed = mark !== undefined;
    }

    let current: Recipe = recipe1;
    let index: number = 0;
    while (current != mark) {
        index++
        current = current.next!;
    }

    return index;
}
