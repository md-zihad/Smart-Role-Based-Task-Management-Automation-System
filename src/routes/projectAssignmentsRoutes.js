const express = require("express");
const db = require("../config/db");
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/roles");

const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Project Assignments
 *   description: Assign employees to projects
 */


/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Assign an employee to a project
 *     tags: [Project Assignments]
 *     security:
 *       - bearerAuth: []
 */

router.post("/", auth, allowRoles("Admin", "Manager"), async (req, res) => {
    const {project_id, user_id} = req.body;

    try {
        const result = await db.query(
            `INSERT INTO project_assignments (project_id, user_id, assigned_by)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [project_id, user_id, req.user.id]
        );
        res.status(201).json({assignment: result.rows[0]});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Assignment failed"});
    }
});


/**
 * @swagger
 * /assignments/project/{project_id}:
 *   get:
 *     summary: Get all employees assigned to a project
 *     tags: [Project Assignments]
 *     security:
 *       - bearerAuth: []
 */

router.get(
  "/project/:project_id",
  auth,
  allowRoles("Admin", "Manager"),
  async (req, res) => {
    const { project_id } = req.params;

    try {
      const result = await db.query(
        `SELECT pa.id, u.username, u.email
         FROM project_assignments pa
         JOIN users u ON pa.user_id = u.id
         WHERE pa.project_id = $1 AND pa.is_active = true`,
        [project_id]
      );

      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  }
);


/**
 * @swagger
 * /assignments/my-projects:
 *   get:
 *     summary: Employee sees only their assigned projects
 *     tags: [Project Assignments]
 *     security:
 *       - bearerAuth: []
 */


router.get(
  "/my-projects",
  auth,
  allowRoles("Employee"),
  async (req, res) => {
    try {
      const result = await db.query(
        `SELECT p.*
         FROM projects p
         JOIN project_assignments pa ON p.id = pa.project_id
         WHERE pa.user_id = $1 AND p.is_active = true`,
        [req.user.id]
      );

      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to fetch employee projects" });
    }
  }
);


/**
 * @swagger
 * /assignments/{id}:
 *   delete:
 *     summary: Remove an employee from a project
 *     tags: [Project Assignments]
 *     security:
 *       - bearerAuth: []
 */


router.delete(
  "/:id",
  auth,
  allowRoles("Admin", "Manager"),
  async (req, res) => {
    const { id } = req.params;

    try {
      const result = await db.query(
        `UPDATE project_assignments
         SET is_active = false, updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Assignment not found" });
      }

      res.json({ message: "Employee unassigned", assignment: result.rows[0] });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Unassign failed" });
    }
  }
);


module.exports = router;




