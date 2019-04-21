import {browser, by, element, protractor} from 'protractor';


describe('Druid Query Visualization e2e test', () => {

  beforeEach( () => {
    browser.get('http://localhost:4200/druid-query-visualization');
  });

  it('Should display time line tittle', () => {
    let title = element(by.id("time-line-h2")).getText();
    expect(title).toEqual('Time line');
  });

  it('Should display message info list tittle', () => {
    let title = element(by.id("message-list-h2")).getText();
    expect(title).toEqual('Message List');
  });
});

describe('Druid Query Visualization e2e test for message flow chart', () => {

  let EC;
  let button;
  let loadingBar;

  beforeEach( () => {
    browser.get('http://localhost:4200/druid-query-visualization');
    EC = protractor.ExpectedConditions;
    button = element(by.id("draw-button"));
    loadingBar = element(by.id("loading-bar"));
  });

  it('Should display message flow charts',   async (done) => {
    let graph = element.all(by.className("graph"));

    //button draw message flow chart
    button.click();
    //waiting for loading bar disappearance
    await browser.wait(EC.not(EC.visibilityOf(loadingBar)));

    graph.then((items) => {
      expect(items.length).toBe(4);
      done();
    });
  });

  it('Should display specific message', async (done) => {
    let node = element.all(by.className("barlabel"));
    let messageList = element(by.css("pre"));

    //button draw message flow chart
    button.click();
    //waiting for loading bar disappearance
    await browser.wait(EC.not(EC.visibilityOf(loadingBar)));

    node.then((items) => {
      items[1].click().then(() => {
        messageList.getText().then((text) => {
          expect(text.indexOf("Message:")).toBeGreaterThan(0)
          done();
        });
      });
    });
  });

  it('Should display notification', async (done) => {
    let notification = element(by.className("notifier__container-list"));

    //button draw message flow chart
    button.click();
    //waiting for loading bar disappearance
    await browser.wait(EC.not(EC.visibilityOf(loadingBar)));
    //second click should display notification
    button.click();

    expect(notification.isPresent()).toBe(true);
    done();
  });
});
