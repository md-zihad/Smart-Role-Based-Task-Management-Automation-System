
const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /example:
 *   get:
 *     summary: Example endpoint
 *     description: Returns a test message.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello from Smart Task API!
 */
router.get('/example', (req, res) => {
  res.json({ message: 'Hello from Smart Task API!' });
});

module.exports = router;
