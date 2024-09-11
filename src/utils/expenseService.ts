import { GoogleSheetsService } from "../services/GoogleSheetsService";
import { IExpenseService } from "../services/IExpenseService";
import { LocalStorageService } from "../services/LocalStorageService";
import { pkceEnabled } from "./pkce";

export const expenseServiceLocator = async (isAuthenticated: boolean, accessToken: string | null): Promise<IExpenseService | null> => {
    if (!pkceEnabled) {
      return LocalStorageService.getInstance();
    }
    if (isAuthenticated && accessToken) {
      return await GoogleSheetsService.getInstance(accessToken);
    }
    return null;
};