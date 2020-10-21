import { DAY_24_IMMUNE_INPUT, DAY_24_INFECTION_INPUT } from './input';

console.log('DAY 24');

type Group = {
    id: number;
    type: string;
    units: number;
    hp: number;
    weaknesses: string[];
    immunities: string[];
    attackDammage: number;
    attackType: string;
    initiative: number;
    toAttack: Group | undefined;
};

function getKey(g: Group): string {
    return `id:${g.id},t:${g.type}`;
}

function buildGroup(input: string, type: string, boost: number): Group[] {
    const rx: RegExp = /(\d+) units each with (\d+) hit points (?:\((.+)\) )*with an attack that does (\d+) (\w+) damage at initiative (\d+)/g;
    const immuneTo: string = 'immune to';
    const weakTo: string = 'weak to';

    const result: Group[] = [];

    let match: RegExpMatchArray | null;
    let id: number = 1;
    while ((match = rx.exec(input)) !== null) {
        const wi: string[] = match[3] !== undefined ? match[3].split(';').map(s => s.trim()) : [];
        let w: string[] | undefined;
        let i: string[] | undefined;
        wi.forEach(t => {
            if (t.startsWith(immuneTo)) {
                i = t.substr(immuneTo.length).split(',').map(rr => rr.trim());
            } else {
                w = t.substr(weakTo.length).split(',').map(rr => rr.trim());
            }
        });

        result.push({
            id: id++,
            type: type,
            units: Number.parseInt(match[1]),
            hp: Number.parseInt(match[2]),
            weaknesses: w !== undefined ? w : [],
            immunities: i !== undefined ? i : [],
            attackDammage: Number.parseInt(match[4]) + boost,
            attackType: match[5],
            initiative: Number.parseInt(match[6]),
            toAttack: undefined
        });
    }

    return result;
}

function calcDamage(attack: Group, defense: Group): number {
    let ep: number = attack.units * attack.attackDammage;
    let result: number = ep;
    if (attack.type === defense.type) {
        result = 0;
    } else if (defense.weaknesses.indexOf(attack.attackType) >= 0) {
        result = ep * 2;
    } else if (defense.immunities.indexOf(attack.attackType) >= 0) {
        result = 0;
    }
    return result;
}

function fight(immunes: Group[], infections: Group[]): void {
    let ok: boolean = true;
    while (ok && immunes.find(i => i.units > 0) && infections.find(i => i.units > 0)) {
        const targeted: { [key: string]: boolean } = {};

        [...immunes.filter(i => i.units > 0), ...infections.filter(i => i.units > 0)].sort((a, b) => {
            const epA: number = a.units * a.attackDammage;
            const epB: number = b.units * b.attackDammage;

            return epA < epB ? -1 : epA > epB ? 1 : a.initiative < b.initiative ? -1 : a.initiative > b.initiative ? 1 : 0
        }).reverse().forEach(g => {
            const targets: Group[] = [...infections, ...immunes].filter(t => t != g);

            const toAttack = targets.filter(t => t.units > 0).sort((a, b) => {
                let damageA: number = calcDamage(g, a);
                let damageB: number = calcDamage(g, b);
                const epA: number = a.units * a.attackDammage;
                const epB: number = b.units * b.attackDammage;

                return damageA < damageB ? -1 : damageA > damageB ? 1 : epA < epB ? -1 : epA > epB ? 1 : a.initiative < b.initiative ? -1 : a.initiative > b.initiative ? 1 : 0;
            }).reverse().find(f => targeted[getKey(f)] === undefined);

            if (toAttack && calcDamage(g, toAttack) > 0) {
                targeted[getKey(toAttack)] = true;
                g.toAttack = toAttack;
            } else {
                g.toAttack = undefined;
            }
        });

        ok = false;
        [...immunes, ...infections].sort((a, b) => {
            return a.initiative < b.initiative ? -1 : a.initiative > b.initiative ? 1 : 0
        }).reverse().forEach(g => {
            if (g.units > 0 && g.toAttack) {
                const damage: number = calcDamage(g, g.toAttack);
                const killed: number = Math.min(g.toAttack.units, Math.floor(damage / g.toAttack.hp));

                g.toAttack.units -= killed;
                ok = ok || killed > 0;
            }
        });
    }
}

// PART 1
doPart1(DAY_24_IMMUNE_INPUT, DAY_24_INFECTION_INPUT);

export function doPart1(immuneInput: string, infectionInput: string): void {
    const immunes: Group[] = buildGroup(immuneInput, 'immune', 0);
    const infections: Group[] = buildGroup(infectionInput, 'infection', 0);

    fight(immunes, infections);

    console.log('immunes', immunes.reduce((p, g) => p + g.units, 0));
    console.log('infections', infections.reduce((p, g) => p + g.units, 0));
}

// PART 2
doPart2(DAY_24_IMMUNE_INPUT, DAY_24_INFECTION_INPUT);

export function doPart2(immuneInput: string, infectionInput: string): void {
    let boost: number = 1;

    let immunes: Group[];
    let infections: Group[];
    do {
        boost++;
        immunes = buildGroup(immuneInput, 'immune', boost);
        infections = buildGroup(infectionInput, 'infection', 0);

        fight(immunes, infections);
    } while (infections.reduce((p, g) => p + g.units, 0) > 0);

    console.log('immunes', immunes.reduce((p, g) => p + g.units, 0));
}
