class BlastScene extends Phaser.Scene {

    constructor() {
        super("BlastScene");
        this.cube_collect_sound = null;
        this.cube_explode_sound = null;
        this.movesText = null;
        this.goalsText = [];
        this.goalSprites = [];
        this.particleEffects = [];
        this.canPick = true;
        this.blastController = new BlastController({
            gridRowCount: 9,
            gridColumnCount: 9,
            gridItemCount: 4,
            moves: gameOptions.moves,
            goals: gameOptions.goals
        });
        this.blastController.initializeGrid();
    }

    preload() {
        this.load.image('background', 'assets/images/background.jpg');
        this.load.image('solidColor1', 'assets/images/solidColor1.png');
        this.load.image('solidColor2', 'assets/images/solidColor2.png');
        this.load.image('solidColor3', 'assets/images/solidColor3.png');
        this.load.image('solidColor4', 'assets/images/solidColor4.png');
        this.load.image('solidColorParticle1', 'assets/images/solidColorParticle1.png');
        this.load.image('solidColorParticle2', 'assets/images/solidColorParticle2.png');
        this.load.audio('cube_collect', 'assets/audio/cube_collect.wav');
        this.load.audio('cube_explode', 'assets/audio/cube_explode.wav');
    }

    create() {
        this.add.image(375, 667, 'background');
        this.adjustMoves(this.blastController.moves);
        this.adjustGoals();
        this.cube_collect_sound = this.sound.add('cube_collect');
        this.cube_explode_sound = this.sound.add('cube_explode');
        this.drawField();
        this.input.on("pointerdown", this.blockSelect, this);
    }


    drawField() {
        let currentBlock = null;
        for (let i = this.blastController.gridRowCount - 1; i >= 0; i--) {
            for (let j = 0; j < this.blastController.gridColumnCount; j++) {
                currentBlock = this.blastController.grid[i][j];
                currentBlock.blockSprite = this.add.sprite(currentBlock.getSpriteX(), currentBlock.getSpriteY(), currentBlock.getSpriteName()).setScale(0.80);
            }
        }
    }

    blockSelect(pointer) {
        if (this.canPick && this.blastController.moves > 0) {
            let { row, column } = this.getPointerRowColumn(pointer);
            if (this.blastController.isValid(row, column)) {
                let connectedBlockList = this.blastController.getConnectedBlockList(row, column);
                if (connectedBlockList.length > 1) {
                    this.blastController.makeMove((move) => this.adjustMoves(move));
                    this.blastController.checkGoals((blockType, amount) => this.adjustGoals(blockType, amount), connectedBlockList);
                    this.cube_explode_sound.play();
                    this.canPick = false;
                    let totalDestroyed = 0;
                    for (let i = 0; i < connectedBlockList.length; i++) {
                        totalDestroyed++;
                        this.tweens.add({
                            targets: connectedBlockList[i].blockSprite,
                            alpha: 0,
                            duration: gameOptions.destroySpeed,
                            callbackScope: this,
                            onComplete: function () {
                                totalDestroyed--;
                                if (totalDestroyed == 0) {
                                    this.destroySprites(connectedBlockList);
                                    this.fill();
                                }
                            }
                        });
                    }
                } else {
                    let [singleBlock] = connectedBlockList;
                    this.shakeSprite(singleBlock.blockSprite);
                }
            }
        }
    }

    getPointerRowColumn(pointer) {
        let columnSelectOffset = gameOptions.boardOffset.x - gameOptions.blockSize / 2;
        let column = Math.floor((pointer.x - columnSelectOffset) / gameOptions.blockSize);
        let rowSelectOffset = gameOptions.boardOffset.y + 8 - gameOptions.blockSize / 2;
        let row = Math.floor((pointer.y - rowSelectOffset) / gameOptions.blockSize);
        return { row, column };
    }

    destroySprites(connectedBlockList) {
        for (let i = 0; i < this.particleEffects.length; i++) {
            this.particleEffects[i].destroy();
        }
        for (let i = 0; i < connectedBlockList.length; i++) {
            connectedBlockList[i].blockSprite.destroy();
            connectedBlockList[i].isEmpty = true;
            this.particleEffect(connectedBlockList[i]);
        }
    }

    fill() {
        let swappedSprites = this.blastController.fill();
        this.fall(swappedSprites);
    }

    compareRow(a, b) {
        if (a.row > b.row)
            return -1;
        if (a.row < b.row)
            return 1;
        return 0;
    }

    fall(swappedSprites) {
        let createdSprites = [];
        let createdBlocks = this.blastController.fall().sort(this.compareRow);

        for (let i = 0; i < createdBlocks.length; i++) {
            let currentBlock = createdBlocks[i];
            currentBlock.blockSprite = this.add.sprite(currentBlock.getSpriteX(), currentBlock.getSpriteFallY(), currentBlock.getSpriteName()).setScale(0.80);
            createdSprites.push(currentBlock);
        }
        for (let i = 0; i < swappedSprites.length; i++) {
            this.tweens.add({
                targets: swappedSprites[i].block.blockSprite,
                y: swappedSprites[i].block.getSpriteY(),
                duration: gameOptions.fallSpeed * swappedSprites[i].deltaRow,
                callbackScope: this
            });
        }
        for (let i = 0; i < createdSprites.length; i++) {
            let deltaDistance = (-1) * createdSprites[i].getSpriteFallY() - createdSprites[i].getSpriteY();
            deltaDistance = Math.abs(Math.ceil(deltaDistance / gameOptions.blockSize));
            this.tweens.add({
                targets: createdSprites[i].blockSprite,
                y: createdSprites[i].getSpriteY(),
                duration: gameOptions.fallSpeed * 6,
                callbackScope: this,
                onComplete: function () {
                    this.canPick = true;
                }
            });
        }
    }

    shakeSprite(sprite) {
        this.cube_collect_sound.play();
        this.tweens.add({
            targets: sprite,
            rotation: 0.5,
            duration: gameOptions.shakeSpeed,
            callbackScope: this,
            onComplete: function () {
                this.tweens.add({
                    targets: sprite,
                    rotation: -0.5,
                    duration: gameOptions.shakeSpeed,
                    callbackScope: this,
                    onComplete: function () {
                        this.tweens.add({
                            targets: sprite,
                            rotation: 0,
                            duration: gameOptions.shakeSpeed,
                            callbackScope: this
                        });
                    }
                });
            }
        });
    }

    adjustMoves(moves) {
        if (this.movesText === null) {
            this.movesText = this.add.text(660 - moves.toString().length * 20, 60, moves.toString(), moveTextStyle);
        } else {
            this.movesText.setText(moves.toString());
            this.movesText.setPosition(660 - moves.toString().length * 20, 60);
        }

    }

    adjustGoals(blockType, amount) {
        if (this.goalsText.length === 0) {
            for (let i = 0; i < this.blastController.goals.length; i++) {
                this.goalSprites.push(
                    this.add.sprite(350 + i * 120, 100, `solidColor${this.blastController.goals[i].type}`).setScale(0.50)
                );
                this.goalsText.push(
                    {
                        blockType: this.blastController.goals[i].type,
                        text: this.add.text(360 + i * 120, 100, this.blastController.goals[i].amount.toString(), goalTextStyle)
                    }
                );
            }
        } else {
            let hitGoalText = this.goalsText.filter(x => x.blockType === blockType);
            hitGoalText[0].text.setText(amount.toString());
        }
    }


    particleEffect(block) {
        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }
        let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        this.particleEffects.push(
            this.physics.add.sprite(
                block.getSpriteX(),
                block.getSpriteY(),
                "solidColorParticle1"
            )
            .setScale(0.7)
            .setVelocityX(getRandomArbitrary(100, 400) * plusOrMinus)
        );
        for (let i = 0; i < 3; i++) {
            this.createParticleEffect(block, "solidColorParticle1");
            this.createParticleEffect(block, "solidColorParticle2");
        }
    }

    createParticleEffect(block, particleName) {
        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }
        let plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        this.particleEffects.push(
            this.physics.add.sprite(
                block.getSpriteX() + plusOrMinus * getRandomArbitrary(5, 20),
                block.getSpriteY() + plusOrMinus * getRandomArbitrary(5, 20),
                particleName
            )
                .setScale(getRandomArbitrary(0.1, 0.3))
                .setVelocityX(getRandomArbitrary(100, 400) * plusOrMinus)
        );


    }



}
