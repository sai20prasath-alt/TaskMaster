function pick(obj, keys) {
  return keys.reduce((acc, key) => {
    if (obj[key] !== undefined) {
      acc[key] = obj[key];
    }

    return acc;
  }, {});
}

function toPagination(page = 1, limit = 20) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  return {
    limit: safeLimit,
    offset: (safePage - 1) * safeLimit,
    page: safePage
  };
}

module.exports = {
  pick,
  toPagination
};
