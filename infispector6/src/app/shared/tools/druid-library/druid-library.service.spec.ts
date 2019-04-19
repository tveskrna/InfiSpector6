import {async, inject, TestBed} from '@angular/core/testing';
import {APP_ENVIRONMENT} from '../../../environment';
import {DruidLibraryService} from './druid-library.service';
import {HttpClientModule} from '@angular/common/http';

describe('DruidLibraryService', () => {

  let druidService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [APP_ENVIRONMENT, DruidLibraryService]
    })
  }));

  beforeEach(inject([DruidLibraryService], (druidLibraryService) =>{
    druidService = druidLibraryService;
  }));

  it('Should get first message time', (done) => {
    druidService.getFirstMessageTime().subscribe((response) => {
      expect(isNaN(response)).toBe(false);
      done();
    });
  });

  it('Should get last message time', (done) => {
    druidService.getLastMessageTime().subscribe((response) => {
      expect(isNaN(response)).toBe(false);
      done();
    });
  });

  it('Should get list of nodes', (done) => {
    druidService.getNodes().subscribe((response) => {
      expect(response.length >= 2).toBe(true);
      done();
    });
  });

  it('Should get messages count between nodes', (done) => {
    druidService.getNodes().subscribe((nodesResponse) => {
      if (nodesResponse.length >= 2) {
        let srcNode = nodesResponse[0];
        let destNode = nodesResponse[1];
        let group = "group0";
        druidService.getMessagesCount(srcNode, destNode, null, group, group).subscribe((messageResponse) => {
          let sameSrcGroup = messageResponse.result[0] == group;
          let sameDstGroup = messageResponse.result[1] == group;
          let isNumber = !isNaN(messageResponse.result[2]);
          expect(sameSrcGroup && sameDstGroup && isNumber).toBe(true);
          done();
        });
      } else {
        fail('There are less than 2 nodes');
      }
    });
  });

  it('Should get nodes info', (done) => {
    druidService.getNodes().subscribe((nodesResponse) => {
      if (nodesResponse.length >= 2) {
        let srcNode = nodesResponse[0];
        let destNode = nodesResponse[1];
        druidService.getNodeInfo(srcNode, null, destNode).subscribe((response) => {
          expect(response.length > 0).toBe(true);
          done();
        });
      } else {
        fail('There are less than 2 nodes');
      }
    });
  });
});
