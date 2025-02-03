import "dotenv/config";
import puppeteer, { Browser, Page } from "puppeteer";

type SynoTokenResponse = {
  SynoToken: string;
};

/**
 * A singleton class that holds the FileStation session id and syno token.
 */
export class FileStationCredentials {
  private static instance: FileStationCredentials;
  public readonly sessionId: string;
  public readonly synoToken: string;

  /**
   * The constructor for a FileStationCredentials object.
   * @param sessionId a valid FileStation session id
   * @param synoToken a valid FileStation auth token
   */
  private constructor(sessionId: string, synoToken: string) {
    this.sessionId = sessionId;
    this.synoToken = synoToken;
  }

  /**
   * Returns the singleton instance of FileStationCredentials.
   * @returns the singleton instance of FileStationCredentials
   */
  public static async getInstance(): Promise<FileStationCredentials> {
    if (!FileStationCredentials.instance) {
      this.instance = await this.getFSCredentials();
    }
    return this.instance;
  }

  /**
   * Refreshes the FileStation credentials.
   */
  public static async updateFSCredentials(): Promise<void> {
    this.instance = await this.getFSCredentials();
  }

  /**
   * Retrieves a valid FileStation session id and SYNO token pair.
   * @returns a FileStationCredentials object containing a valid session id and
   * SYNO token
   */
  private static getFSCredentials = async (): Promise<FileStationCredentials> => {
    console.log("Updating FileStation credentials...");
    const { FS_API_URL } = process.env;
    const url = `${FS_API_URL}/webman/index.cgi`;

    // Create headless browser and login
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    // Submit login form and get syno token and session id
    await this.submitLoginForm(page);
    const synoToken = await this.getSynoToken(page);
    const sessionId = await this.getSessionId(browser);

    console.log(`Successfully updated FileStation credentials.`);
    await browser.close();
    return new FileStationCredentials(sessionId, synoToken);
  };

  /**
   * Retrieves the session id by getting it from the browser's cookies.
   * @param browser the browser used to login
   * @returns the session id
   */
  private static async getSessionId(browser: Browser): Promise<string> {
    const cookies = await browser.cookies();
    if (cookies.length < 2) {
      throw Error("Expected 2 cookies, but got " + cookies.length);
    }
    const sessionIdCookie = cookies[1];
    return sessionIdCookie.value;
  }

  /**
   * Determines whether a response is a SynoTokenResponse.
   * @param synoTokenRes the response object in question
   * @returns whether it is a SynoTokenResponse
   */
  private static isSynoTokenResponse = (
    synoTokenRes: unknown
  ): synoTokenRes is SynoTokenResponse => {
    return (synoTokenRes as SynoTokenResponse).SynoToken !== undefined;
  };

  /**
   * Retrieves the SYNO token response, which is received after logging in successfully.
   * @param page the login page
   * @returns the syno token
   */
  private static async getSynoToken(page: Page): Promise<string> {
    const synoTokenRes = await page.waitForResponse((res) => {
      const synoTokenRoute = "login.cgi";
      return res.url().includes(synoTokenRoute);
    });
    const synoTokenResBody = await synoTokenRes.json();
    if (this.isSynoTokenResponse(synoTokenResBody)) {
      return synoTokenResBody.SynoToken;
    }
    await page.waitForSelector("#sds-desktop", { visible: true, timeout: 0 });
    throw Error("Failed to retrieve SYNO token");
  }

  /**
   * Fills out and submits the login form on the login page.
   * @param page the login page
   */
  private static async submitLoginForm(page: Page) {
    const { FS_API_USERNAME, FS_API_PASSWORD } = process.env;

    const usernameField = await page.$("#login_username");
    const passwordField = await page.$("#login_passwd");
    if (!usernameField || !passwordField) {
      throw Error("Could not find username/password field");
    }
    await usernameField.type(FS_API_USERNAME!);
    await passwordField.type(FS_API_PASSWORD!);
    const rememberMeBtnId = "#ext-gen22";
    const submitBtnId = "#ext-gen23";
    await page.click(rememberMeBtnId);
    await page.click(submitBtnId);
  }
}
