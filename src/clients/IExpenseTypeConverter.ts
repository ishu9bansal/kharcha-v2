import { Expense } from '../types/Expense';

export interface IExpenseTypeConverter<T> {
    // this is important contract to reduce the common mistakes which can happen in code
    // these methods need to be defined at one place only and should be reused whereever needed
    // the code should not have multiple copies of these methods lingering around in every methods
    serialize(expense: Expense): T;
    deserialize(value: T): Expense;
}
