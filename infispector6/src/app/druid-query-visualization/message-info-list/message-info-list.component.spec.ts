import {TestBed, async} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {MessageInfoListComponent} from './message-info-list.component';
import {APP_ENVIRONMENT} from '../../environment';
import {DruidLibraryService} from '../../shared/tools/druid-library/druid-library.service';

describe('MessageInfoListComponent', () => {

  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MessageInfoListComponent,
      ],
      imports: [
        HttpClientModule
      ],
      providers: [
        DruidLibraryService,
        APP_ENVIRONMENT
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    let fixture = TestBed.createComponent(MessageInfoListComponent);
    component = fixture.debugElement.componentInstance;
    component.setMessagesInfo(["firstMessage", "secondMessage", "thirdMessage"]);
  });

  it('Should create the Message Info List component', () => {
    expect(component).toBeTruthy();
  });

  it('should get second message', () => {
    component.nextNodeMessageInfo();
    let messages = component.getMessagesInfo();
    let pages = component.getPage().split("/");

    expect(pages[0] == 2).toBe(true);
    expect(pages[1] == 3).toBe(true);
    expect(messages[pages[0] - 1]).toEqual( "secondMessage");
  });

  it('should get last message', () => {
    component.prevNodeMessageInfo();
    let messages = component.getMessagesInfo();
    let pages = component.getPage().split("/");

    expect(pages[0] == 3).toBe(true);
    expect(pages[1] == 3).toBe(true);
    expect(messages[pages[0] - 1]).toEqual( "thirdMessage");
  });

});
