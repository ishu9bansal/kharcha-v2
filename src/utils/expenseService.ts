import { GoogleSheetsService } from "../services/GoogleSheetsService";
import { ExpenseServiceEnum, IExpenseService } from "../services/IExpenseService";
import { LocalStorageService } from "../services/LocalStorageService";
import { pkceEnabled } from "./pkce";

export const expenseServiceEnumLocator = async (isAuthenticated: boolean, accessToken: string | null): Promise<ExpenseServiceEnum | null> => {
    if (!pkceEnabled) {
      return ExpenseServiceEnum.LocalStorage;
    }
    if (isAuthenticated && accessToken) {
      await GoogleSheetsService.initWithAccessToken(accessToken);
      return ExpenseServiceEnum.GoogleSheets;
    }
    return null;
};

export function getServiceFromEnum(serviceEnum: ExpenseServiceEnum | null): IExpenseService | null {
    switch(serviceEnum){
        case ExpenseServiceEnum.GoogleSheets:
            return GoogleSheetsService.getInstance();
        case ExpenseServiceEnum.LocalStorage:
            return LocalStorageService.getInstance();
        default:
            return null;
    }
}
