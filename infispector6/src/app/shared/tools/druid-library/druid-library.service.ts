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

  getFirstMessageTime() {
    let self = this;
    return this.http.post(this.baseUrl + "/getMinimumMessageTime", null, {responseType: 'json'}).pipe(
      map((response:DruidResponse) => {
        let jsonResponse = JSON.parse(response.jsonResponseAsString);
        //TODO is here some way how to fix timestamp
        //TODO timestamp send still same time
        return jsonResponse[0].timeMillis;
        // return response;
      })
    );
  };

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

  getNodes() {
    return this.http.post(this.baseUrl + "/getNodes", null, {responseType: 'json'}).pipe(
      map((response:DruidResponse) => {
        return response.jsonResponseAsString.replace("[", "").replace("]","").split(",");
      })
    );
  }

  getMessagesCount(srcNode, destNode, filter, groupSrc, groupDest) {
    let body = {
      "srcNode": srcNode,
      "destNode": destNode,
      "searchMessageText": filter,
      "groupSrc": groupSrc,
      "groupDest": groupDest
    };

    return this.http.post(this.baseUrl + "/getMessagesCount", body, {responseType: 'json'});
  }

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
        //TODO jak funguje tahle
        for (let i = 0; i < jsonResponse.length; i++) {
          nodeMessagesInfo[i] = "\nnode name: " + nodeName + "\ncount: " + jsonResponse[i].length + "\nmessage: " + jsonResponse[i].message + "\n\n\n" + (i + 1) + "/" + jsonResponse.length;
        }

        return nodeMessagesInfo;
        //$scope.messageInfo = $scope.nodeMessagesInfo[0];
      })
    );
  }
}
