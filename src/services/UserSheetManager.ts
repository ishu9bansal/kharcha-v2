// src/services/UserSheetManager.ts
import { SessionManager } from './SessionManager';
import { createNewSpreadsheet } from '../utils/googleSheetsHelper';

export class UserSheetManager {
  private static instance: UserSheetManager;
  private userSheetIds: Map<string, string> = new Map(); // Store user sheet IDs

  private constructor() {}

  public static getInstance(): UserSheetManager {
    if (!UserSheetManager.instance) {
      UserSheetManager.instance = new UserSheetManager();
    }
    return UserSheetManager.instance;
  }

  public async getOrCreateSheetId(userId: string): Promise<string> {
    if (this.userSheetIds.has(userId)) {
      return this.userSheetIds.get(userId)!;
    } else {
      const accessToken = SessionManager.getInstance().getAccessToken(userId);
      const sheetId = await createNewSpreadsheet(accessToken!); // Create a new spreadsheet if none exists
      this.userSheetIds.set(userId, sheetId);
      return sheetId;
    }
  }
}
