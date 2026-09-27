
export interface CustomerLoanLookup {
    userId: string;
    firstName: string;
    lastName: string;
    fin: string;
    birthDate: string;
    loans: Loan[];
}
