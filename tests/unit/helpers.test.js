const { pick, toPagination } = require('../../src/utils/helpers');

describe('helpers', () => {
  test('pick returns only defined allowed keys', () => {
    const input = { a: 1, b: undefined, c: 3 };
    const output = pick(input, ['a', 'b']);

    expect(output).toEqual({ a: 1 });
  });

  test('toPagination constrains and computes offset', () => {
    const pagination = toPagination(2, 10);

    expect(pagination).toEqual({
      page: 2,
      limit: 10,
      offset: 10
    });
  });
});
