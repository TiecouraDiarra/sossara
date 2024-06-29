// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    // Url_BASE:"https://api.sossara.ml/api",
    // Url_PHOTO:"https://api.sossara.ml",
    // socketUrl: 'https://api.sossara.ml/chat-socket'

    Url_BASE:"http://127.0.0.1:8080/api",
    Url_PHOTO:"http://127.0.0.1:8080",
    socketUrl: '//127.0.0.1:8080/chat-socket'

    // Url_BASE:"http://10.175.48.169:8080/api",
    // Url_PHOTO:"http://10.175.48.169:8080",
    // socketUrl: 'http://10.175.48.169:8080/chat-socket'
    
  };
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
  