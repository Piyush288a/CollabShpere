// Shared pagination helpers used by list endpoints (projects, user search).
// Kept dependency-free and pure so they are trivially unit-testable.

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

// Parses raw query params into safe { page, limit, skip }.
// - page: integer >= 1 (invalid/zero/negative/non-numeric -> 1)
// - limit: integer 1..100 (invalid/zero/negative/non-numeric -> default 10; > 100 -> 100)
const parsePagination = (query = {}) => {
  const rawPage = Number.parseInt(query.page, 10);
  const rawLimit = Number.parseInt(query.limit, 10);

  const page = Number.isInteger(rawPage) && rawPage >= 1 ? rawPage : DEFAULT_PAGE;

  let limit = Number.isInteger(rawLimit) && rawLimit >= 1 ? rawLimit : DEFAULT_LIMIT;
  if (limit > MAX_LIMIT) limit = MAX_LIMIT;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// Builds the response metadata block from a total count and the active page/limit.
// Empty result sets yield totalPages: 0 (as documented).
const buildPagination = ({ totalCount, page, limit }) => ({
  currentPage: page,
  totalPages: Math.ceil(totalCount / limit),
  totalCount,
});

module.exports = { parsePagination, buildPagination };
