// src/services/SessionManager.ts
export class SessionManager {
    private static instance: SessionManager;
    private userSessions: Map<string, string> = new Map(); // Store user sessions with access tokens
  
    private constructor() {}
  
    public static getInstance(): SessionManager {
      if (!SessionManager.instance) {
        SessionManager.instance = new SessionManager();
      }
      return SessionManager.instance;
    }
  
    public setAccessToken(userId: string, accessToken: string): void {
      this.userSessions.set(userId, accessToken);
    }
  
    public getAccessToken(userId: string): string | undefined {
      return this.userSessions.get(userId);
    }
  
    public clearSession(userId: string): void {
      this.userSessions.delete(userId);
    }
  }
  