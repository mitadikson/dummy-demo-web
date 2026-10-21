export type MyTuple = [string, string, number];

type Size = 'small' | 'medium' | 'large';
type SizeMessage = `The selected size is ${Size}.`;

type NonNullableProps<T> = {
  [key in keyof T]: NonNullable<T[key]>;
};

interface User {
  firstName?: string | null;
  lastName: string | null;
  age: number;
}

type Car = 'ICE' | 'EV';
type ChargeEv = (kws: number) => void;
type FillPetrol = (type: string, litres: number) => void;
type RefileHandler<A extends Car> = A extends 'ICE'
  ? FillPetrol
  : A extends 'EV'
    ? ChargeEv
    : never;

const chargeTesla: RefileHandler<'EV'> = (kws: number) => {
  console.log(`Electrical energy charge: ${kws} kW`);
};
const chargeFord: RefileHandler<'ICE'> = (type: string, litres: number) => {
  console.log(`Fill petrol ${type}: ${litres} litres`);
};

export const mita = () => {
  const mitaTuple: MyTuple = ['Dimitrije', 'dimitrijevic', 34];

  console.log(mitaTuple);
  console.log(mitaTuple[0]);
  console.log(mitaTuple[1]);
  console.log(mitaTuple[2]);

  const user1: NonNullableProps<User> = {
    firstName: 'Dimitrije',
    lastName: 'Dimitrijevic',
    age: 34,
  };

  const user2: User = {
    // firstName: null,
    lastName: 'Dimitrijevic',
    age: 34,
  };

  console.log("'firstName' in user1", 'firstName' in user1);
  console.log("'firstName' in user2", 'firstName' in user2);

  chargeTesla(100);
  chargeFord('Diesel', 50);

  const message: SizeMessage = 'The selected size is small.';

  return mitaTuple;
};
