const handler = require('../../../../srv/PoetrySlamService/PoetrySlams/before-UPDATE');

describe('Before UPDATE PoetrySlam (oyster)', () => {
  let req;
  let whereMock;

  beforeEach(() => {
    whereMock = jest.fn();

    global.SELECT = {
      one: {
        from: jest.fn(() => ({
          where: whereMock
        }))
      }
    };
    req = {
      data: require('../testdata/before-UPDATEData.json').eventVisitorData,
      error: jest.fn()
    };
  });

  afterEach(() => {
    delete global.SELECT;
    jest.clearAllMocks();
  });

  it('should raise error if caterer capacity is lower', async () => {
    whereMock.mockResolvedValue({
      ID: 'C1',
      maxServiceCapacity: 100
    });

    await handler.call(
      { entities: { x_Caterers: {} } },
      req
    );

    expect(req.error).toHaveBeenCalledWith(
      422,
      "Service capacity of caterer (100) is less than the event's max capacity (120)"
    );
  });

  it('should NOT raise error if capacity is sufficient', async () => {
    whereMock.mockResolvedValue({
      ID: 'C1',
      maxServiceCapacity: 150
    });

    await handler.call(
      { entities: { x_Caterers: {} } },
      req
    );

    expect(req.error).not.toHaveBeenCalled();
  });
    // Additional test case for when x_caterer_ID is undefined
  it('should return early when x_caterer_ID is undefined', async () => {
    req.data = {
      ...req.data,
      x_caterer_ID: undefined
    };

    await handler(req);

    expect(global.SELECT.one.from).not.toHaveBeenCalled();
    expect(req.error).not.toHaveBeenCalled();
  });

  // Additional test case for when x_caterer_ID is empty string
  it('should return early when x_caterer_ID is empty string', async () => {
    req.data = {
      ...req.data,
      x_caterer_ID: ''
    };

    await handler(req);

    expect(global.SELECT.one.from).not.toHaveBeenCalled();
    expect(req.error).not.toHaveBeenCalled();
  });
});
