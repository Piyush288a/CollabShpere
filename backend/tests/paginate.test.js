const { parsePagination, buildPagination } = require('../utils/paginate');

// ---------------------------------------------------------------------------
// parsePagination — turns raw query params into { page, limit, skip }
// ---------------------------------------------------------------------------
describe('parsePagination', () => {
  it('should default to page 1 and limit 10 when nothing is provided', () => {
    expect(parsePagination({})).toEqual({ page: 1, limit: 10, skip: 0 });
  });

  it('should accept custom page and limit', () => {
    expect(parsePagination({ page: '2', limit: '5' })).toEqual({
      page: 2,
      limit: 5,
      skip: 5,
    });
  });

  it('should compute skip as (page - 1) * limit', () => {
    expect(parsePagination({ page: '3', limit: '10' })).toEqual({
      page: 3,
      limit: 10,
      skip: 20,
    });
  });

  it('should hard-cap limit at 100', () => {
    expect(parsePagination({ page: '1', limit: '500' })).toEqual({
      page: 1,
      limit: 100,
      skip: 0,
    });
  });

  it('should clamp a negative or zero page to 1', () => {
    expect(parsePagination({ page: '0' }).page).toBe(1);
    expect(parsePagination({ page: '-4' }).page).toBe(1);
  });

  it('should clamp a negative or zero limit to the default', () => {
    expect(parsePagination({ limit: '0' }).limit).toBe(10);
    expect(parsePagination({ limit: '-7' }).limit).toBe(10);
  });

  it('should fall back to defaults for non-numeric values', () => {
    expect(parsePagination({ page: 'abc', limit: 'xyz' })).toEqual({
      page: 1,
      limit: 10,
      skip: 0,
    });
  });

  it('should accept numeric (non-string) values', () => {
    expect(parsePagination({ page: 2, limit: 20 })).toEqual({
      page: 2,
      limit: 20,
      skip: 20,
    });
  });
});

// ---------------------------------------------------------------------------
// buildPagination — builds the response metadata block
// ---------------------------------------------------------------------------
describe('buildPagination', () => {
  it('should build the documented metadata shape', () => {
    expect(buildPagination({ totalCount: 48, page: 1, limit: 10 })).toEqual({
      currentPage: 1,
      totalPages: 5,
      totalCount: 48,
    });
  });

  it('should round totalPages up (ceil)', () => {
    expect(buildPagination({ totalCount: 21, page: 1, limit: 10 }).totalPages).toBe(3);
  });

  it('should compute totalPages as 1 when count equals limit', () => {
    expect(buildPagination({ totalCount: 10, page: 1, limit: 10 }).totalPages).toBe(1);
  });

  it('should return totalPages 0 for an empty result set (as documented)', () => {
    expect(buildPagination({ totalCount: 0, page: 1, limit: 10 })).toEqual({
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
    });
  });

  it('should reflect the requested current page', () => {
    expect(buildPagination({ totalCount: 48, page: 3, limit: 10 }).currentPage).toBe(3);
  });
});
