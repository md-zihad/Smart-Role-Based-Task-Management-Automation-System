const express = require('express');
const router = express.Router();
const auth = require("../middlewares/auth");
const allowRoles = require("../middlewares/roles");


router.post("/", auth, allowRoles("Admin"), (req, res) => {
    res.json({message: "Project created (admin Only)"});
});

router.get("/", auth, allowRoles("Admin", "Manager"), (req, res) => {
    res.json({message: "Project created (admin Only)"});
});

router.put("/:id", auth, allowRoles("Admin", "Manager"), (req, res) => {
    res.json({message: "Project created (admin Only)"});
});

router.delete("/", auth, allowRoles("Admin"), (req, res) => {
    res.json({message: "Project created (admin Only)"});
});

module.exports = router;