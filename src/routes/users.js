
const express = require('express');
const db = require('../config/db');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 */

router.get('/users', async (req, res) => {
    try {
        const result = await db.query(
            `
            SELECT u.id, u.username, u.email, r.name AS role
            FROM users u
            LEFT JOIN roles r on u.role_id = r.id`
        );
        res.json(result.rows);
    }catch (err){
        console.log(err);
        res.status(500).json({error: 'failed to fetch users'});
    }
});


/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/users', async (req, res) => {
  const { username, email, password, role_id } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO users (username, email, password, role_id)
       VALUES ($1, $2, $3, $4) RETURNING id, username, email, role_id`,
      [username, email, password, role_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user', detail: err.message });
  }
});


/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user (signup)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully
 */

router.post('/signup', async (req, res) => {
    const {username, email, password, role_id} = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await db.query(
        `
          INSERT INTO users (username, email, password, role_id)
          VALUES ($1, $2, $3, $4) RETURNING id, username, email, role_id`,
          [username, email, hashedPassword, role_id]
        
      );
      res.status(201).json({user: result.rows[0]});
    }catch (err){
      console.log(err);
      res.status(500).json({error: 'signup failed', detail: err.message});
    }
});

module.exports = router;

