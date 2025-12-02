const router = require("express").Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/roles");

const {
  createProject,
  getAllProject,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");


router.post("/", auth, allowRoles("Admin"), createProject);

router.get("/", auth, allowRoles("Admin", "Manager"), getAllProject);

router.get("/:id", auth, allowRoles("Admin", "Manager"), getProjectById);

router.put("/:id", auth, allowRoles("Admin", "Manager"), updateProject);

router.delete("/:id", auth, allowRoles("Admin"), deleteProject);

module.exports = router;
