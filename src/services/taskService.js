const { Op } = require('sequelize');
const { Task, User, Team, sequelize } = require('../models');
const { toPagination } = require('../utils/helpers');

const ALLOWED_SORT_BY = ['dueDate', 'createdAt', 'title'];

function buildTaskFilters(query) {
  const where = {};
  const dialect = sequelize.getDialect();
  const likeOperator = dialect === 'postgres' ? Op.iLike : Op.like;

  if (query.status) {
    where.status = query.status;
  }

  if (query.assignee) {
    where.assignedTo = query.assignee;
  }

  if (query.team) {
    where.teamId = query.team;
  }

  if (query.search) {
    where[Op.or] = [
      { title: { [likeOperator]: `%${query.search}%` } },
      { description: { [likeOperator]: `%${query.search}%` } }
    ];
  }

  return where;
}

async function listTasks(query) {
  const where = buildTaskFilters(query);
  const sortBy = ALLOWED_SORT_BY.includes(query.sortBy) ? query.sortBy : 'createdAt';
  const order = (query.order || 'desc').toLowerCase() === 'asc' ? 'ASC' : 'DESC';
  const { limit, offset, page } = toPagination(query.page, query.limit);

  const result = await Task.findAndCountAll({
    where,
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
      { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
      { model: Team, as: 'team', attributes: ['id', 'name'] }
    ],
    order: [[sortBy, order]],
    limit,
    offset
  });

  return {
    items: result.rows,
    pagination: {
      total: result.count,
      page,
      limit,
      pages: Math.ceil(result.count / limit)
    }
  };
}

module.exports = {
  listTasks
};
