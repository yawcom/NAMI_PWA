// Start Scene
class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {
        this.load.image('background', 'assets/bg.png');
        this.load.image('bg1', 'assets/bg1.png');
        this.load.image('bg2', 'assets/bg2.png');
        this.load.image('ship', 'assets/ship.png');
        this.load.image('chest', 'assets/chest.png');
        this.load.image('obstacle', 'assets/obstacle.png');
        this.load.image('water', 'assets/water.png');
        this.load.image('copy', 'assets/Copy.png');
    }

    create() {
        // Add background
        this.add.image(0, 0, 'background').setOrigin(0).setDisplaySize(config.width, config.height);
        //this.add.image(0, 0, 'background').setOrigin(0);
        // Game title
        const titleText = this.add.text(config.width / 2, config.height / 8, 'Raccogli i tesori con Nami', {
            fontFamily: 'Arial',
            fontSize: '35px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        this.add.rectangle( config.width/2, config.height /4, config.width, 80, 0x16213e).setOrigin(0.5, 0.5).setAlpha(0.5);
        // Game instructions text
        const instructionsText = this.add.text(config.width / 2, config.height / 4, 
            'Guida la tua nave pirata attraverso mari insidiosi, raccogli il maggior\n numero di forzieri schiva le isole \nper conquistare la gloria dei sette mari!', {
            fontFamily: 'Arial',
            fontSize: '15px',
            fontStyle: 'bold',
            color: '#fff',
            //stroke: '#fff',
            //strokeThickness: 0.5,
            align: 'center'
            //wordWrap: { width: config.width * 0.8 }
        }).setOrigin(0.5);//.setShadow(2, 2, '#000000', 2, false, true);

        instructionsText.setText('');
        const fullText = 'Guida la tua nave pirata attraverso mari insidiosi, raccogli il maggior\n numero di forzieri schiva le isole \nper conquistare la gloria dei sette mari!';
        let i = 0;

        this.time.addEvent({
            delay: 30,
            repeat: fullText.length - 1,
            callback: () => {
                instructionsText.text += fullText[i];
                i++;
            }
        });

        // Replace Copyright text with image
        const copyImage = this.add.image((config.width / 2)+50, config.height - 15, 'copy')
            .setOrigin(0.5)
            .setScale(0.25); // Adjust scale as needed for your image


        // Start button - create a container with background and text
        const buttonWidth = 150;
        const buttonHeight = 50;
        const buttonX = config.width / 2;
        const buttonY = config.height / 2 +25;
        
        // Create a softer, more gradient-like shadow for the button
        const shadowGraphics = this.add.graphics();
        shadowGraphics.fillStyle(0x000000, 0.2);
        //shadowGraphics.fillRoundedRect(buttonX - buttonWidth/2 + 2, buttonY - buttonHeight/2 + 2, buttonWidth, buttonHeight, 16);
        shadowGraphics.fillRoundedRect(buttonX - buttonWidth/2 + 2, buttonY -buttonHeight/2+2, buttonWidth, buttonHeight, 16);
        shadowGraphics.fillStyle(0x000000, 0.1);
        shadowGraphics.fillRoundedRect(buttonX - buttonWidth/2 + 6, buttonY - buttonHeight/2 + 6, buttonWidth, buttonHeight, 16);
        
        // Create button background with border
        const startButtonBg = this.add.rectangle(buttonX, buttonY, buttonWidth, buttonHeight, 0x90EE90)
            .setOrigin(0.5)
            .setInteractive()
            .setStrokeStyle(4, 0x006600); // Dark green border
        
        // Create text without stroke
        const startButtonText = this.add.text(buttonX, buttonY, 'START', {
            fontFamily: 'Arial',
            fontSize: '30px',
            fontStyle: 'bold',
            color: '#000000'  // Black text without stroke
        }).setOrigin(0.5);
        
        // Add hover effect to the background
        startButtonBg.on('pointerover', () => {
            startButtonBg.setScale(1.1);
            startButtonText.setScale(1.1);
        });

        startButtonBg.on('pointerout', () => {
            startButtonBg.setScale(1);
            startButtonText.setScale(1);
        });

        // Start game on button click
        startButtonBg.on('pointerdown', () => {
			this.registraPartita();
            this.scene.start('GameScene');
        });
	}
	
	// Funzione per registrare la partita
    registraPartita() {
		const url = 'https://script.google.com/macros/s/AKfycbya7GidybLreaB9P7-dXhA6vg-5QpIUekeJz2E0xSkqkuoJPn6aNNH_WGBP1PgnkwryLw/exec';
		fetch(`${url}?evento=NAMI`)
			.then(response => response.text())
			.then(data => console.log('NAMI:', data))
			.catch(error => console.error('Errore durante la registrazione della partita:', error));
	}
}

// Game Scene
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // Reset game settings
        gameSettings.score = 0;
        gameSettings.lives = 3;
        gameSettings.scrollSpeed = 2;
        
        // Create water background with a simpler approach
        this.waterTiles = [];
        for (let i = 0; i < 3; i++) {
            // Create a graphics object directly
            const water = this.add.graphics();
            
            // Set position
            water.x = i * config.width;
            water.y = 0;
            
            // Create a blue gradient for water
            water.fillGradientStyle(
                0x0077be, 0x0077be,  // Light blue at top
                0x005588, 0x005588   // Darker blue at bottom
            );
            water.fillRect(0, 0, config.width, config.height);
            
            // Add some wave patterns
            water.lineStyle(2, 0x3399ff, 0.3);
            for (let y = 0; y < config.height; y += 20) {
                water.beginPath();
                for (let x = 0; x < config.width; x += 10) {
                    const waveHeight = Math.sin(x / 30) * 5;
                    if (x === 0) {
                        water.moveTo(x, y + waveHeight);
                    } else {
                        water.lineTo(x, y + waveHeight);
                    }
                }
                water.strokePath();
            }
            
            // Set water to be in the background
            water.setDepth(-1);
            
            this.waterTiles.push(water);
        }

        // Create a more realistic animated water background
        this.waterBackground = this.add.graphics();
        this.waterBackground.fillStyle(0x0055aa, 1);
        this.waterBackground.fillRect(0, 0, config.width, config.height);
        this.waterBackground.setDepth(-2);
        
        // Create multiple wave layers for depth effect
        this.waveLayers = [];
        const waveColors = [0x0077cc, 0x0099dd, 0x00bbee];
        const waveAlphas = [0.7, 0.5, 0.3];
        
        for (let i = 0; i < 3; i++) {
            const waveGraphics = this.add.graphics();
            waveGraphics.setDepth(-1 + i * 0.1);
            this.waveLayers.push({
                graphics: waveGraphics,
                offset: i * 200,
                speed: 1 + i * 0.5,
                amplitude: 10 - i * 2,
                frequency: 0.02 + i * 0.01,
                color: waveColors[i],
                alpha: waveAlphas[i]
            });
        }
        
                // Aggiungi terra ferma nella parte inferiore
                //this.createLandscape();

        // Add some random sparkles for water highlights
        this.sparkles = [];
        for (let i = 0; i < 50; i++) {
            const sparkle = this.add.circle(
                Phaser.Math.Between(0, config.width),
                Phaser.Math.Between(0, config.height),
                Phaser.Math.Between(1, 3),
                0xffffff,
                Phaser.Math.FloatBetween(0.1, 0.3)
            );
            sparkle.setDepth(-0.5);
            this.sparkles.push({
                sprite: sparkle,
                speed: Phaser.Math.FloatBetween(0.2, 1),
                alpha: Phaser.Math.FloatBetween(0.1, 0.3),
                alphaDir: 1
            });
        }

        // Create player ship - positioned closer to the center
        this.ship = this.physics.add.sprite(config.width / 3, config.height / 2, 'ship');
        this.ship.setCollideWorldBounds(true);
        this.ship.setScale(0.80); // Changed from 0.5 to 0.25 (50% smaller)
        // Rotate ship to face right
        this.ship.setAngle(0);
        // Ensure ship is above water
        //this.ship.setDepth(1);

        // Create groups for chests and obstacles
        this.chests = this.physics.add.group();
        this.obstacles = this.physics.add.group();

        // Create a group for chest bubbles
        this.bubbles = this.add.group();

        // Set up collisions
        this.physics.add.overlap(this.ship, this.chests, this.collectChest, null, this);
        this.physics.add.overlap(this.ship, this.obstacles, this.hitObstacle, null, this);


        // Implementazione del controllo con swipe
        this.input.on('pointerdown', (pointer) => {
            this.dragStartY = pointer.y;
            this.isDragging = true;
        });

        this.input.on('pointermove', (pointer) => {
            if (this.isDragging) {
                // Calcola la differenza tra la posizione attuale e quella iniziale
                const dragDelta = pointer.y - this.dragStartY;
                
                // Aggiorna la posizione della nave solo se c'è un movimento significativo (swipe)
                if (Math.abs(dragDelta) > 5) {
                    // Aggiorna la posizione della nave in base al movimento dello swipe
                    const newY = this.ship.y + dragDelta * 0.5; // Moltiplica per un fattore per controllare la sensibilità
                    
                    // Limita il movimento verticale per evitare la terra e il bordo superiore
                    const topPadding = 25;
                    const bottomLimit = this.landY ? this.landY - 25 : config.height - 25;
                    
                    this.ship.y = Phaser.Math.Clamp(newY, topPadding, bottomLimit);
                    
                    // Aggiorna il punto di partenza per il prossimo calcolo
                    this.dragStartY = pointer.y;
                }
            }
        });

        this.input.on('pointerup', () => {
            this.isDragging = false;
        });

        // mmmm Set up touch input - now only controls vertical movement
        //this.input.on('pointermove', (pointer) => {
        //    if (pointer.isDown) {
        //        // Only allow vertical movement (up and down)
        //        // Adjust the clamp values to allow movement closer to the edges
        //        const padding = 25; // Small padding from the very edge
        //        this.ship.y = Phaser.Math.Clamp(
        //            pointer.y, 
        //            padding, 
        //            config.height - padding
        //        );
        //    }
        //});

        // Game timer
        this.timeLeft = gameSettings.gameTime;
        this.gameTimer = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        // Speed increase timer
        this.speedTimer = this.time.addEvent({
            delay: 10000, // 20 seconds
            callback: this.increaseSpeed,
            callbackScope: this,
            loop: true
        });

        // Spawn items timer
        this.spawnTimer = this.time.addEvent({
            delay: 1500,
            callback: this.spawnItems,
            callbackScope: this,
            loop: true
        });

        // Invulnerability flag
        this.isInvulnerable = false;

        // UI elements - positioned horizontally with time left, score center, lives right
        const uiY = 5; // Y position for all UI elements
        const textStyle = {
            fontFamily: 'Arial',
            fontSize: '12px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        };
        
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        this.add.rectangle(width/2, 30, width, 70, 0x16213e).setOrigin(0.5, 0.5).setAlpha(0.5);
        
        // Create UI text elements
        const timeText = this.add.text(0, uiY, 'Tempo: 60', textStyle);
        const scoreText = this.add.text(0, uiY, 'Punteggio: 0', textStyle);
        const livesText = this.add.text(0, uiY, 'Vite: 3', textStyle);
        
        // Position UI elements: time left, score center, lives right
        const padding = 50; // Padding from edges
        
        timeText.setPosition(config.width / 2, uiY).setOrigin(0.5, 0);
        scoreText.setPosition(config.width / 2, uiY+20).setOrigin(0.5, 0); // Center horizontally
        livesText.setPosition(config.width / 2, uiY+40).setOrigin(0.5, 0); // Right aligned
        
        this.scoreText = scoreText;
        this.livesText = livesText;
        this.timeText = timeText;
    }

    update() {
        // Animate water waves
        this.waveLayers.forEach(wave => {
            wave.offset += wave.speed;
            wave.graphics.clear();
            wave.graphics.lineStyle(4, wave.color, wave.alpha);
            
            // Draw multiple wave lines
            for (let y = 0; y < config.height + 50; y += 50) {
                wave.graphics.beginPath();
                
                for (let x = 0; x < config.width + 10; x += 10) {
                    const yPos = y + Math.sin((x + wave.offset) * wave.frequency) * wave.amplitude;
                    
                    if (x === 0) {
                        wave.graphics.moveTo(x, yPos);
                    } else {
                        wave.graphics.lineTo(x, yPos);
                    }
                }
                
                wave.graphics.strokePath();
            }
        });
        
        // Animate sparkles
        this.sparkles.forEach(sparkle => {
            sparkle.sprite.x -= sparkle.speed;
            if (sparkle.sprite.x < 0) {
                sparkle.sprite.x = config.width;
                sparkle.sprite.y = Phaser.Math.Between(0, config.height);
            }
            
            // Make sparkles twinkle
            sparkle.sprite.alpha += 0.01 * sparkle.alphaDir;
            if (sparkle.sprite.alpha > sparkle.alpha + 0.2 || sparkle.sprite.alpha < sparkle.alpha - 0.1) {
                sparkle.alphaDir *= -1;
            }
        });

        // Move obstacles and chests horizontally
        this.chests.getChildren().forEach(chest => {
            chest.x -= gameSettings.scrollSpeed;
            
            // Update chest's glass effect
            if (chest.update) {
                chest.update();
            }
            
            // Create bubbles randomly from chests
            if (Phaser.Math.Between(0, 30) === 0) {
                this.createBubble(chest.x, chest.y);
            }
            
            if (chest.x < -50) {
                chest.destroy();
            }
        });
        
        // Update bubbles
        this.bubbles.getChildren().forEach(bubble => {
            bubble.y -= bubble.speed;
            bubble.alpha -= 0.01;
            bubble.scale -= 0.005;
            
            if (bubble.alpha <= 0 || bubble.y < 0) {
                bubble.destroy();
            }
        });

        this.obstacles.getChildren().forEach(obstacle => {
            obstacle.x -= gameSettings.scrollSpeed;
            if (obstacle.x < -50) {
                obstacle.destroy();
            }
        });
    }

    updateTimer() {
        this.timeLeft--;
        this.timeText.setText(`Tempo: ${this.timeLeft}`);
        
        if (this.timeLeft <= 0) {
            this.gameTimer.remove();
            this.speedTimer.remove();
            this.spawnTimer.remove();
            this.scene.start('GameOverScene', { score: gameSettings.score });
        }
    }

    increaseSpeed() {
        gameSettings.scrollSpeed += 1;
        console.log(`Speed increased to ${gameSettings.scrollSpeed}`);
    }

    spawnItems() {
        // Randomly spawn chests and obstacles
        if (Phaser.Math.Between(0, 1) === 0) {
            const y = Phaser.Math.Between(50, config.height - 50);
            const chest = this.chests.create(config.width + 50, y, 'chest');
            chest.setScale(0.80);
            
            // Add glass effect to chest
            this.addGlassEffect(chest);
            
            // Create initial bubbles for the chest
            for (let i = 0; i < 3; i++) {
                this.createBubble(chest.x, chest.y);
            }
        }

        if (Phaser.Math.Between(0, 2) === 0) {
            const y = Phaser.Math.Between(50, config.height - 50);
            const obstacle = this.obstacles.create(config.width + 50, y, 'obstacle');
            obstacle.setScale(0.30); // Changed from 0.4 to 0.36 (10% smaller)
        }
    }
    
    addGlassEffect(chest) {
        // Set chest to be slightly transparent
        chest.setAlpha(0.97);
        
        // Add a slight tint to give it a glass-like appearance
        chest.setTint(0xc0e8ff);
        
        // Create a glass shine effect (highlight)
        const shine = this.add.graphics();
        shine.fillStyle(0xffffff, 0.6);
        
        // Draw a small highlight shape
        const shineSize = 6;
        shine.fillCircle(chest.x - 5, chest.y - 5, shineSize);
        
        // Make the shine follow the chest
        this.tweens.add({
            targets: shine,
            alpha: { from: 0.6, to: 0.2 },
            yoyo: true,
            repeat: -1,
            duration: 1500,
            ease: 'Sine.easeInOut'
        });
        
        // Store the shine reference in the chest object
        chest.shine = shine;
        
        // Update the shine position in the update method
        chest.update = () => {
            if (chest.shine) {
                chest.shine.x = chest.x - 5;
                chest.shine.y = chest.y - 5;
            }
        };
        
        // Clean up the shine when the chest is destroyed
        const originalDestroy = chest.destroy;
        chest.destroy = function() {
            if (this.shine) {
                this.shine.destroy();
            }
            originalDestroy.call(this);
        };
    }
    
    update() {
        // Animate water waves
        this.waveLayers.forEach(wave => {
            wave.offset += wave.speed;
            wave.graphics.clear();
            wave.graphics.lineStyle(4, wave.color, wave.alpha);
            
            // Draw multiple wave lines
            for (let y = 0; y < config.height + 50; y += 50) {
                wave.graphics.beginPath();
                
                for (let x = 0; x < config.width + 10; x += 10) {
                    const yPos = y + Math.sin((x + wave.offset) * wave.frequency) * wave.amplitude;
                    
                    if (x === 0) {
                        wave.graphics.moveTo(x, yPos);
                    } else {
                        wave.graphics.lineTo(x, yPos);
                    }
                }
                
                wave.graphics.strokePath();
            }
        });
        
        // Animate sparkles
        this.sparkles.forEach(sparkle => {
            sparkle.sprite.x -= sparkle.speed;
            if (sparkle.sprite.x < 0) {
                sparkle.sprite.x = config.width;
                sparkle.sprite.y = Phaser.Math.Between(0, config.height);
            }
            
            // Make sparkles twinkle
            sparkle.sprite.alpha += 0.01 * sparkle.alphaDir;
            if (sparkle.sprite.alpha > sparkle.alpha + 0.2 || sparkle.sprite.alpha < sparkle.alpha - 0.1) {
                sparkle.alphaDir *= -1;
            }
        });

        // Move obstacles and chests horizontally
        this.chests.getChildren().forEach(chest => {
            chest.x -= gameSettings.scrollSpeed;
            
            // Update chest's glass effect
            if (chest.update) {
                chest.update();
            }
            
            // Create bubbles randomly from chests
            if (Phaser.Math.Between(0, 30) === 0) {
                this.createBubble(chest.x, chest.y);
            }
            
            if (chest.x < -50) {
                chest.destroy();
            }
        });
        
        // Update bubbles
        this.bubbles.getChildren().forEach(bubble => {
            bubble.y -= bubble.speed;
            bubble.alpha -= 0.01;
            bubble.scale -= 0.005;
            
            if (bubble.alpha <= 0 || bubble.y < 0) {
                bubble.destroy();
            }
        });

        this.obstacles.getChildren().forEach(obstacle => {
            obstacle.x -= gameSettings.scrollSpeed;
            if (obstacle.x < -50) {
                obstacle.destroy();
            }
        });
    }

    createBubble(x, y) {
        // Create a bubble at the chest's position
        const offsetX = Phaser.Math.Between(-10, 10);
        const bubble = this.add.circle(
            x + offsetX, 
            y - 5, 
            Phaser.Math.Between(2, 5),
            0xaaddff,
            0.7
        );
        
        // Set bubble properties
        bubble.speed = Phaser.Math.FloatBetween(0.5, 1.5);
        bubble.setDepth(0.5);
        
        // Add to bubbles group
        this.bubbles.add(bubble);
    }

    collectChest(ship, chest) {
        // Only collect the chest if the ship is passing over it (ship's y position is above the chest)
        if (ship.x > chest.x) {
            // Create the +10 score text effect at the chest's position
            const scorePopup = this.add.text(chest.x, chest.y, '+10 punti!!', {
                fontFamily: 'Arial',
                fontSize: '24px',
                fontStyle: 'bold',
                color: '#ffff00',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);
            
            // Add animation effects to the score popup
            this.tweens.add({
                targets: scorePopup,
                y: chest.y - 50, // Move upward
                alpha: { from: 1, to: 0 }, // Fade out
                scale: { from: 1, to: 1.5 }, // Grow slightly
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    scorePopup.destroy(); // Remove when animation completes
                }
            });
            
            // Add a small flash effect
            const flash = this.add.circle(chest.x, chest.y, 40, 0xffff00, 0.7);
            flash.setDepth(3);
            
            this.tweens.add({
                targets: flash,
                scale: 2,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    flash.destroy();
                }
            });
            
            chest.destroy();
            gameSettings.score += 10;
            this.scoreText.setText(`Punteggio: ${gameSettings.score}`);
        }
    }

    hitObstacle(ship, obstacle) {
        if (ship.x > obstacle.x && !this.isInvulnerable) {
            // Create the -1 life text effect at the obstacle's position
            const damagePopup = this.add.text(obstacle.x, obstacle.y, '-1 vita!', {
                fontFamily: 'Arial',
                fontSize: '24px',
                fontStyle: 'bold',
                color: '#ff3333',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);
            
            // Add animation effects to the damage popup
            this.tweens.add({
                targets: damagePopup,
                y: obstacle.y - 50, // Move upward
                alpha: { from: 1, to: 0 }, // Fade out
                scale: { from: 1, to: 1.5 }, // Grow slightly
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    damagePopup.destroy(); // Remove when animation completes
                }
            });
            
            // Add a red flash effect
            const flash = this.add.circle(obstacle.x, obstacle.y, 40, 0xff0000, 0.7);
            flash.setDepth(3);
            
            this.tweens.add({
                targets: flash,
                scale: 2,
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    flash.destroy();
                }
            });
            
            // Add screen shake effect
            this.cameras.main.shake(200, 0.01);
            
            obstacle.destroy();
            gameSettings.lives--;
            this.livesText.setText(`Vite: ${gameSettings.lives}`);
            
            // Make ship transparent for 3 seconds
            this.isInvulnerable = true;
            this.ship.setAlpha(0.5);
            
            // Flash the ship to indicate damage
            this.tweens.add({
                targets: this.ship,
                alpha: { from: 0.5, to: 0.2 },
                yoyo: true,
                repeat: 5,
                duration: 200
            });
            
            this.time.delayedCall(3000, () => {
                this.isInvulnerable = false;
                this.ship.setAlpha(1);
            });
            
            if (gameSettings.lives <= 0) {
                this.gameTimer.remove();
                this.speedTimer.remove();
                this.spawnTimer.remove();
                this.scene.start('GameOverScene', { score: gameSettings.score });
            }
        }
    }

    createLandscape() {
        // Crea un gruppo per la terra
        this.landGroup = this.add.group();
        
        // Altezza della terra
        const landHeight = 15//config.height * 0.15;
        const landY = config.height - landHeight;
        
        // Crea la base della terra
        const land = this.add.graphics();
        land.fillStyle(0x8B4513, 1); // Marrone per la terra
        land.fillRect(0, landY, config.width, landHeight);
        
        // Aggiungi dettagli alla terra
        land.fillStyle(0x654321, 0.7);
        
        // Crea una linea irregolare per il bordo superiore della terra
        const points = [];
        const segments = 20;
        const segmentWidth = config.width / segments;
        
        for (let i = 0; i <= segments; i++) {
            const x = i * segmentWidth;
            const y = landY + Phaser.Math.Between(-10, 5);
            points.push(new Phaser.Geom.Point(x, y));
        }
        
        // Disegna il bordo superiore irregolare
        land.beginPath();
        land.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            land.lineTo(points[i].x, points[i].y);
        }
        
        land.lineTo(config.width, landY + landHeight);
        land.lineTo(0, landY + landHeight);
        land.closePath();
        land.fillPath();
        
        // Aggiungi vegetazione più realistica
        // Crea strati di vegetazione per dare profondità
        const vegetationLayers = 3;
        const plantsPerLayer = 8;
        const treeColors = [0x004400, 0x005500, 0x006600, 0x007700];
        const bushColors = [0x003300, 0x004400, 0x005500, 0x006600];
        
        for (let layer = 0; layer < vegetationLayers; layer++) {
            // Ogni strato ha una profondità diversa
            const layerDepth = 0.9 + (layer * 0.01);
            const layerScale = 1 - (layer * 0.2); // Gli strati più lontani sono più piccoli
            const layerAlpha = 1 - (layer * 0.15); // Gli strati più lontani sono più trasparenti
            
            for (let i = 0; i < plantsPerLayer; i++) {
                const x = Phaser.Math.Between(0, config.width);
                const y = landY - Phaser.Math.Between(2, 12);
                
                const vegetation = this.add.graphics();
                vegetation.setDepth(layerDepth);
                vegetation.setAlpha(layerAlpha);
                
                // Scegli casualmente tra diversi tipi di vegetazione
                const plantType = Phaser.Math.Between(0, 3);
                
                if (plantType === 0) {
                    // Albero più dettagliato
                    const treeColor = treeColors[Phaser.Math.Between(0, treeColors.length - 1)];
                    const trunkHeight = Phaser.Math.Between(15, 25) * layerScale;
                    const trunkWidth = Phaser.Math.Between(2, 4) * layerScale;
                    const leafSize = Phaser.Math.Between(10, 15) * layerScale;
                    
                    // Tronco
                    vegetation.fillStyle(0x5C4033, 1);
                    vegetation.fillRect(x - (trunkWidth/2), y - trunkHeight, trunkWidth, trunkHeight);
                    
                    // Fogliame (più strati per dare volume)
                    vegetation.fillStyle(treeColor, 0.9);
                    vegetation.fillCircle(x, y - trunkHeight, leafSize);
                    vegetation.fillStyle(treeColor, 0.8);
                    vegetation.fillCircle(x - leafSize/3, y - trunkHeight - leafSize/3, leafSize * 0.8);
                    vegetation.fillStyle(treeColor, 0.7);
                    vegetation.fillCircle(x + leafSize/3, y - trunkHeight - leafSize/4, leafSize * 0.7);
                } 
                else if (plantType === 1) {
                    // Cespuglio più dettagliato
                    const bushColor = bushColors[Phaser.Math.Between(0, bushColors.length - 1)];
                    const bushSize = Phaser.Math.Between(5, 10) * layerScale;
                    
                    // Crea un cespuglio con più cerchi sovrapposti
                    vegetation.fillStyle(bushColor, 0.9);
                    vegetation.fillCircle(x, y, bushSize);
                    vegetation.fillStyle(bushColor, 0.8);
                    vegetation.fillCircle(x - bushSize/2, y - bushSize/4, bushSize * 0.7);
                    vegetation.fillStyle(bushColor, 0.7);
                    vegetation.fillCircle(x + bushSize/2, y - bushSize/3, bushSize * 0.6);
                }
                else if (plantType === 2) {
                    // Fiori o erba alta
                    const stemHeight = Phaser.Math.Between(5, 10) * layerScale;
                    
                    // Stelo
                    vegetation.lineStyle(1 * layerScale, 0x006600, 0.8);
                    vegetation.lineBetween(x, y, x, y - stemHeight);
                    
                    // Fiore o foglia
                    if (Phaser.Math.Between(0, 1) === 0) {
                        // Fiore
                        const flowerColors = [0xFFFF00, 0xFF6347, 0xDA70D6, 0xFF69B4];
                        const flowerColor = flowerColors[Phaser.Math.Between(0, flowerColors.length - 1)];
                        vegetation.fillStyle(flowerColor, 0.9);
                        vegetation.fillCircle(x, y - stemHeight, 2 * layerScale);
                    } else {
                        // Foglia
                        vegetation.fillStyle(0x008800, 0.8);
                        vegetation.fillTriangle(
                            x, y - stemHeight,
                            x + 4 * layerScale, y - stemHeight + 2 * layerScale,
                            x, y - stemHeight + 4 * layerScale
                        );
                    }
                }
                else {
                    // Palma o pianta esotica
                    const trunkHeight = Phaser.Math.Between(20, 30) * layerScale;
                    const trunkWidth = Phaser.Math.Between(2, 3) * layerScale;
                    
                    // Tronco leggermente curvo
                    vegetation.fillStyle(0x8B5A2B, 1);
                    
                    // Disegna un tronco curvo usando più rettangoli
                    const segments = 5;
                    const curveFactor = Phaser.Math.Between(-3, 3) * layerScale;
                    
                    for (let s = 0; s < segments; s++) {
                        const segmentHeight = trunkHeight / segments;
                        const segmentY = y - (s * segmentHeight);
                        const offsetX = Math.sin((s / segments) * Math.PI) * curveFactor;
                        
                        vegetation.fillRect(
                            x - (trunkWidth/2) + offsetX, 
                            segmentY - segmentHeight, 
                            trunkWidth, 
                            segmentHeight
                        );
                    }
                    
                    // Foglie di palma
                    vegetation.fillStyle(0x008800, 0.8);
                    
                    // Numero di foglie
                    const numLeaves = Phaser.Math.Between(3, 5);
                    const leafLength = Phaser.Math.Between(10, 15) * layerScale;
                    
                    for (let l = 0; l < numLeaves; l++) {
                        const angle = (l / numLeaves) * Math.PI;
                        const leafX = x + Math.cos(angle) * leafLength;
                        const leafY = y - trunkHeight + Math.sin(angle) * leafLength/2;
                        
                        vegetation.lineBetween(x, y - trunkHeight, leafX, leafY);
                        
                        // Aggiungi dettagli alle foglie
                        vegetation.fillStyle(0x009900, 0.7);
                        vegetation.fillTriangle(
                            x, y - trunkHeight,
                            leafX, leafY,
                            leafX + Math.cos(angle + 0.2) * 5 * layerScale, 
                            leafY + Math.sin(angle + 0.2) * 5 * layerScale
                        );
                    }
                }
                
                this.landGroup.add(vegetation);
            }
        }
        
        
        // Imposta la profondità per assicurarsi che la terra sia sopra l'acqua ma sotto gli altri elementi
        land.setDepth(0.8);
        this.landGroup.setDepth(0.9);
        
        // Modifica i limiti di movimento della nave per evitare la collisione con la terra
        const shipPadding = 25;
        const shipBottomLimit = landY - shipPadding;
        
        // Aggiorna l'evento di input per limitare il movimento verticale
        this.input.off('pointermove'); // Rimuovi l'evento esistente
        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                // Limita il movimento verticale per evitare la terra
                const padding = 25; // Padding dal bordo superiore
                this.ship.y = Phaser.Math.Clamp(
                    pointer.y, 
                    padding, 
                    shipBottomLimit
                );
            }
        });
    }
}

// Game Over Scene
class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    preload() {
        // Preload the additional background images if not already loaded
        if (!this.textures.exists('bg1')) {
            this.load.image('bg1', 'assets/bg1.png');
        }
        if (!this.textures.exists('bg2')) {
            this.load.image('bg2', 'assets/bg2.png');
        }
    }

    init(data) {
        this.finalScore = data.score;
    }

    create() {
        // Add background based on score
        const bgKey = this.finalScore < 200 ? 'bg1' : 'bg2';
        this.add.image(0, 0, bgKey).setOrigin(0).setDisplaySize(config.width, config.height);

        const textGameOver = this.finalScore < 200 ? 'Game Over' : 'Hai Vinto!';
        // Game over text
        this.add.text(config.width / 2, config.height / 5, textGameOver, {
            fontFamily: 'Arial',
            fontSize: '35px',
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Final score
        this.add.text(config.width / 2, config.height / 3-30, `Punteggio finale: ${this.finalScore}`, {
            fontFamily: 'Arial',
            fontSize: '25px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Play again button - create a container with background and text
        const buttonWidth = 150;
        const buttonHeight = 50;
        const buttonX = config.width / 2;
        const buttonY = config.height / 2 + 25;
        
        // Create a softer, more gradient-like shadow for the button
        const shadowGraphics = this.add.graphics();
        shadowGraphics.fillStyle(0x000000, 0.2);
        shadowGraphics.fillRoundedRect(buttonX - buttonWidth/2 + 2, buttonY - buttonHeight/2 + 2, buttonWidth, buttonHeight, 16);
        shadowGraphics.fillStyle(0x000000, 0.1);
        shadowGraphics.fillRoundedRect(buttonX - buttonWidth/2 + 6, buttonY - buttonHeight/2 + 6, buttonWidth, buttonHeight, 16);
        
        // Create button background with border
        const playAgainButtonBg = this.add.rectangle(buttonX, buttonY, buttonWidth, buttonHeight, 0x90EE90)
            .setOrigin(0.5)
            .setInteractive()
            .setStrokeStyle(4, 0x006600); // Dark green border
        
        // Create text without stroke
        const playAgainButtonText = this.add.text(buttonX, buttonY, 'Nuova partita', {
            fontFamily: 'Arial',
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#000000'  // Black text without stroke
        }).setOrigin(0.5);
        
        // Add hover effect to the background
        playAgainButtonBg.on('pointerover', () => {
            playAgainButtonBg.setScale(1.1);
            playAgainButtonText.setScale(1.1);
        });

        playAgainButtonBg.on('pointerout', () => {
            playAgainButtonBg.setScale(1);
            playAgainButtonText.setScale(1);
        });

        // Restart game on button click
        playAgainButtonBg.on('pointerdown', () => {
            this.scene.start('StartScene');
        });
    }
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: Math.min(window.innerWidth, window.innerHeight), // Use the smaller dimension
    height: Math.min(window.innerWidth, window.innerHeight), // Use the same value for height
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [StartScene, GameScene, GameOverScene]
};

// Global variables
let gameSettings = {
    score: 0,
    lives: 3,
    gameTime: 60, // 60 seconds game duration
    scrollSpeed: 2,
    gameWidth: config.width,
    gameHeight: config.height
};



// Initialize the game
const game = new Phaser.Game(config);