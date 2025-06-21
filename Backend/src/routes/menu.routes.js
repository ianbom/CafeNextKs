// src/routes/menu.routes.js
const express = require('express');
const menuController = require('../controllers/menu.controller');

const router = express.Router();

// Routes untuk Menu
router.post('/', menuController.createMenu);       // POST /api/menus
router.get('/', menuController.getAllMenus);       // GET /api/menus
router.get('/:id', menuController.getMenuById);    // GET /api/menus/:id
router.put('/:id', menuController.updateMenu);     // PUT /api/menus/:id
router.delete('/:id', menuController.deleteMenu);  // DELETE /api/menus/:id

module.exports = router;