const paginate = async (Model, query, options = {}) => {
  const { page = 1, limit = 12, sort = { createdAt: -1 }, populate = [], select } = options;
  const skip = (page - 1) * limit;
  let q = Model.find(query).sort(sort).skip(skip).limit(limit);
  if (select) q = q.select(select);
  populate.forEach(p => { q = q.populate(p); });
  const [data, total] = await Promise.all([q.exec(), Model.countDocuments(query)]);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export default paginate;
