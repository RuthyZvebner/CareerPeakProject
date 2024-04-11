// // // google-auth.service.ts
// // import { Injectable } from '@angular/core';
// // import { google } from 'googleapis';

// // @Injectable({
// //   providedIn: 'root'
// // })
// // export class GoogleAuthService {

// //   private oauth2Client: any; // ניתן להוסיף טיפוס נכון עבור oauth2Client

// //   constructor() { 
// //     // Replace these values with your own OAuth client ID and client secret
// //     const CLIENT_ID = '1090075035158-pg0dcr8ieid3o1stthnvmruibm9msm21.apps.googleusercontent.com';
// //     const CLIENT_SECRET = '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';

// //     // Create an OAuth2 client instance
// //     this.oauth2Client = new google.auth.OAuth2(
// //       CLIENT_ID,
// //       CLIENT_SECRET,
// //       'http://localhost:4200' // Replace this with your redirect URI
// //     );
// //   }

// //   generateAuthUrl(): string {
// //     // Generate a URL that asks permissions for Gmail API scopes
// //     const scopes = [
// //       'https://mail.google.com/',
// //       'https://www.googleapis.com/auth/gmail.modify',
// //       'https://www.googleapis.com/auth/gmail.compose',
// //     ];
// //     return this.oauth2Client.generateAuthUrl({
// //       access_type: 'offline',
// //       scope: scopes,
// //     });
// //   }
// // }

// import { Injectable } from '@angular/core';
// import { google } from 'googleapis';
// import { HttpClient } from '@angular/common/http'; // הוסף את HttpClient כאן

// @Injectable({
//   providedIn: 'root'
// })
// export class GoogleAuthService {

//   private oauth2Client: any;

//   constructor(private http: HttpClient) { // הוסף את HttpClient ב-constructor
//     const CLIENT_ID = '1090075035158-pg0dcr8ieid3o1stthnvmruibm9msm21.apps.googleusercontent.com';
//     const CLIENT_SECRET = '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';

//     this.oauth2Client = new google.auth.OAuth2(
//       CLIENT_ID,
//       CLIENT_SECRET,
//       'http://localhost:4200'
//     );
//   }

//   generateAuthUrl(): string {
//     const scopes = [
//       'https://mail.google.com/',
//       'https://www.googleapis.com/auth/gmail.modify',
//       'https://www.googleapis.com/auth/gmail.compose',
//     ];
//     return this.oauth2Client.generateAuthUrl({
//       access_type: 'offline',
//       scope: scopes,
//     });
//   }
// }

