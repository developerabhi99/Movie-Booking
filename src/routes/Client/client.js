const { Router } = require("express");
const router = Router();


const movieRoute = require("./movieRoutes");
const screenLayoutTemplateRoutes = require("./screenLayoutTemplateRoutes");
const screenRoutes = require("./screenRoutes");
const showRoutes = require("./showRoutes");
const theaterRoutes = require("./theaterRoutes");


router.use("/movies", movieRoute);
router.use("/screenLayoutTemplates", screenLayoutTemplateRoutes);
router.use("/screens", screenRoutes);
router.use("/shows", showRoutes);
router.use("/theaters", theaterRoutes);

module.exports = router;
