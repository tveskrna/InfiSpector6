import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {APP_ENVIRONMENT} from '../../../environment';
import {map} from 'rxjs/operators';
import {DruidResponse} from './DruidResponse';

@Injectable()
export class DruidLibraryService {

  private baseUrl:string;

  constructor(private http: HttpClient, private env: APP_ENVIRONMENT) {
    this.baseUrl = this.env.getServerUrl();
  }

  /**
   * Get time of first entry in milliseconds
   */
  getFirstMessageTime() {
    let self = this;
    return this.http.post(this.baseUrl + "/getMinimumMessageTime", null, {responseType: 'json'}).pipe(
      map((response:DruidResponse) => {
        let jsonResponse = JSON.parse(response.jsonResponseAsString);
        //TODO is here some way how to fix timestamp
        //TODO timestamp send still same time
        return jsonResponse[0].timeMillis;
      })
    );
  };

  /**
   * Get time of last entry in milliseconds
   */
  getLastMessageTime() {
    return this.http.post(this.baseUrl + "/getMaximumMessageTime", null, {responseType: 'json'}).pipe(
      map((response:DruidResponse) => {
        let jsonResponse = JSON.parse(response.jsonResponseAsString);
        //TODO is here some way how to fix timestamp
        //TODO timestamp send still same time
        return jsonResponse[0].timeMillis;
        // return response;
      })
    );
  };

  /**
   * Get array of infinispan nodes
   */
  getNodes() {
    return this.http.post(this.baseUrl + "/getNodes", null, {responseType: 'json'}).pipe(
      map((response:DruidResponse) => {
        return response.jsonResponseAsString.split(",");
      })
    );
  }

  /**
   * Get messages count between two nodes
   * Return json: {
   *                result: queryResult,
   *                searchMessageText: searchMessageText
   *              };
   *
   * Result contains array: [source node, destination node, messages count]
   */
  getMessagesCount(srcNode, destNode, filter, groupSrc, groupDest) {
    let body = {
      "srcNode": srcNode,
      "destNode": destNode,
      "searchMessageText": filter,
      "groupSrc": groupSrc,
      "groupDest": groupDest
    };

    return this.http.post(this.baseUrl + "/getMessagesCount", body, {responseType: 'json'}).pipe(
      map((response:DruidResponse) => {
        return JSON.parse(response.jsonResponseAsString);
      })
    );
  }

  /**
   * Get
   */
  getNodeInfo(nodeName, filter, srcDest) {

    let body = {
      "srcNode": (!srcDest) ? nodeName : null,
      "destNode": (srcDest) ? nodeName : null,
      "filter": filter
    };

    return this.http.post(this.baseUrl + "/getMessagesInfo", body, {responseType: 'json'}).pipe(
      map((response: DruidResponse) => {
        let jsonResponse = JSON.parse(response.jsonResponseAsString);
        let nodeMessagesInfo = [];
        for (let i = 0; i < jsonResponse.length; i++) {
          let reAfter = /([,{=])/g;
          let reBefore = /([}=])/g;
          let message = jsonResponse[i].message;

          message = message.replace(reBefore, " $1");
          message = message.replace(reAfter, "$1 ")
          ;
          nodeMessagesInfo[i] = "\nNode name: " + nodeName +                      //node name
                                "\n\nCount: " + jsonResponse[i].length +          //count
                                "\n\nMessage: " + message;                        //message
        }

        return nodeMessagesInfo;
      })
    );
  }
}
