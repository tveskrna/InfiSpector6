export class APP_ENVIRONMENT {
  private SERVER_URL:string = "http://localhost:8000";

  getServerUrl() {
    return this.SERVER_URL;
  }
}
