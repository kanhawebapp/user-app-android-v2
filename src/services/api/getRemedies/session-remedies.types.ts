export interface SessionRemedy {
  id: string;

  sessionId: string;

  remedyText: string;

  createdAt: string;
}

export interface GetSessionRemediesResponse {
  getSessionRemedies: SessionRemedy[];
}