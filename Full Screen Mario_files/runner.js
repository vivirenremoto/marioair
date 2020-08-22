FullScreenMario.prototype.settings.runner = {
    "upkeepScheduler": setTimeout,
    "upkeepCanceller": clearTimeout,
    "interval": 1000 / 60,
    "adjustFramerate": true,
    "games": [
        function () {
            this.QuadsKeeper.determineAllQuadrants("Scenery", this.GroupHolder.getSceneryGroup());
            this.QuadsKeeper.determineAllQuadrants("Text", this.GroupHolder.getTextGroup());
            // Should delete out-of-bounds stuff here
        },
        function () {
            this.maintainSolids(this, this.GroupHolder.getSolidGroup());
        },
        function () {
            this.maintainCharacters(this, this.GroupHolder.getCharacterGroup());
        },
        function () {
            this.maintainPlayer(this, this.player);
        },
        function () {
            this.TimeHandler.handleEvents();
        },
        function () {
            this.PixelDrawer.refillGlobalCanvas(this.MapsHandler.getArea().background);
            // this.PixelDrawer.refillQuadrantGroups(
                // this.QuadsKeeper.getQuadrantRows(),
                // this.MapsHandler.getArea().background
            // );
        }
    ]
}