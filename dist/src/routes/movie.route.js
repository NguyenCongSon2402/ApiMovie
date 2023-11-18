"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const middleware_1 = require("../middleware");
const schema_1 = require("../schema");
const router = (0, express_1.Router)();
router.get("/movies/search", controllers_1.MovieController.searchMovie);
router.post("/movies", middleware_1.authenticateToken, (0, middleware_1.validateRequestSchema)(schema_1.createMovieSchema), controllers_1.MovieController.createMovie);
router.put("/movies/:id", controllers_1.MovieController.updateMovie);
router.delete("/movies/:id", controllers_1.MovieController.deleteMovie);
router.get("/movies/:id", controllers_1.MovieController.getMovieById);
exports.default = router;
