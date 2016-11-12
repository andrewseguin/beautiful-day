import { Ng2BeautifulDayPage } from './app.po';

describe('ng2-beautiful-day App', function() {
  let page: Ng2BeautifulDayPage;

  beforeEach(() => {
    page = new Ng2BeautifulDayPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
