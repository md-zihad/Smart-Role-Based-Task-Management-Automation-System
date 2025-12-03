const router = require("express").Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/roles");

const {
  assignProject,
  getAllEmployees,
  getMyProjects,
  deleteEmployee
} = require("../controllers/projectAssignmentController");



router.post("/", auth, allowRoles("Admin", "Manager"), assignProject);

router.get("/project/:project_id", auth, allowRoles("Admin", "Manager"), getAllEmployees);

router.get("/my-projects", auth, allowRoles("Employee"), getMyProjects);

router.delete("/:id", auth, allowRoles("Admin", "Manager"), deleteEmployee);

module.exports = router;
