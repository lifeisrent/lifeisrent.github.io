import crypto from "crypto";

const siteUrl = "https://lifeisrent.pages.dev";
const path = "/fridge/";
const secretKey = "mapleand-money-2026-git-rich";

const expires = Math.floor(Date.now() / 1000) + 60 * 60 * 12;
const message = path + ":" + expires;

const signature = crypto
  .createHmac("sha256", secretKey)
  .update(message)
  .digest("hex");

const signedUrl = `${siteUrl}${path}?expires=${expires}&signature=${signature}`;

console.log(signedUrl);