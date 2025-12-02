const db = require("../config/db");

const createProject = async (req, res) => {
  const { name, description, deadline } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO projects (name, description, deadline, created_by)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
      [name, description, deadline, req.user.id]
    );

    res.status(201).json({ project: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Project creation failed" });
  }
};

const getAllProject = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM projects WHERE is_active = true`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

const getProjectById = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await db.query(`SELECT * FROM projects WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Cannot find project" });
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, deadline } = req.body;

  try {
    const result = await db.query(
      `UPDATE projects
         SET name=$1, description=$2, deadline=$3, updated_by=$4, updated_at=NOW()
         WHERE id=$5
         RETURNING *`,
      [name, description, deadline, req.user.id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE projects SET is_active = false, updated_by=$1 WHERE id=$2 RETURNING *`,
      [req.user.id, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted", project: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};

module.exports = {
  createProject,
  getAllProject,
  getProjectById,
  updateProject,
  deleteProject,
};
