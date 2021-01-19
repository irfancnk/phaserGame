class ParticleEffectFactory {
    
    constructor(physics) {
        this.physics = physics;
    }

    createParticleEffect(block, particleName) {
        let totalRotate = 25;
        let particleEffect = this.physics.add.sprite(
            block.getSpriteX() + this.getPlusOrMinus() * this.getRandomArbitrary(5, 20),
            block.getSpriteY() + this.getPlusOrMinus() * this.getRandomArbitrary(5, 20),
            particleName
        )
        .setScale(this.getRandomArbitrary(0.2, 0.45))
        .setVelocityX(this.getRandomArbitrary(100, 300) * this.getPlusOrMinus())
        .setVelocityY(this.getRandomArbitrary(500, 700) * -1)
        let rotateInterval = setInterval(function () {
            if (totalRotate === 0) {
                clearInterval(rotateInterval)
            }
            totalRotate--;
            particleEffect.angle += 10
        }, 50)
        return particleEffect;
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    getPlusOrMinus() {
        return Math.random() < 0.5 ? -1 : 1;;
    }
}


class SpriteEffectFactory {
    
    constructor(tweens) {
        this.tweens = tweens;
    }

    createShakeSpriteEffect(sprite) {
        return this.tweens.add({
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

    createFallSpriteEffect(swappedSprite) {
        return this.tweens.add({
            targets: swappedSprite.block.blockSprite,
            y: swappedSprite.block.getSpriteY(),
            duration: gameOptions.fallSpeed * swappedSprite.deltaRow
        });
    }

    createFallSpriteEffectCallback(createdSprite, callback) {
        return this.tweens.add({
            targets: createdSprite.blockSprite,
            y: createdSprite.getSpriteY(),
            duration: gameOptions.fallSpeed * 6,
            callbackScope: this,
            onComplete: () => callback()
        });
    }

}


