const character = document.getElementById('character');
const mapContainer = document.getElementById('map-container');
const gameContainer = document.getElementById('game-container');

// Generate triggers
for (let i = 1; i <= 40; i++) {
    
    const triggerEvent = document.createElement('div');
    triggerEvent.classList.add('trigger-event');
    triggerEvent.id = `trigger-event-${i}`;
  
    const triggerImage = document.createElement('img');
    triggerImage.src = 'assets/rose.png';
    triggerImage.alt = `Trigger ${i}`;
  
    triggerEvent.appendChild(triggerImage);
    gameContainer.appendChild(triggerEvent);
}


const triggerEvents = document.querySelectorAll('.trigger-event');

// Position of the character at the begining of the game
let characterPosition = { top: 50, left: 50 };

// handle for touch events.
// Useful for tactiles device.
// Instead of swiping multiple times, the character moves
// when the finger's on the screen
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchmove', handleTouchMove);
document.addEventListener('touchend', handleTouchEnd);
let isTouching = false;

function handleTouchStart(event) {
    isTouching = true;
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    if (!isTouching) return;

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    moveCharacter(dx, dy);

    touchStartX = touchEndX;
    touchStartY = touchEndY;
}

function handleTouchEnd() {
    isTouching = false;
}

// handle for key events.
// Makes the game playable with pc.
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            moveCharacter(0, -50);
            break;
        case 'ArrowDown':
            moveCharacter(0, 50);
            break;
        case 'ArrowLeft':
            moveCharacter(-50, 0);
            break;
        case 'ArrowRight':
            moveCharacter(50, 0);
            break;
    }
});

function moveCharacter(dx, dy) {
    characterPosition = {
        top: characterPosition.top + dy,
        left: characterPosition.left + dx
    };

    // Check boundaries to prevent the character from moving outside the map
    outboundMessage = "Be careful or the character will get lost !"

    if (characterPosition.top < 0) {
        characterPosition.top = 0;
        showAlert(outboundMessage);
    }
    if (characterPosition.top + character.clientHeight > mapContainer.clientHeight) {
        characterPosition.top = mapContainer.clientHeight - character.clientHeight;
        showAlert(outboundMessage);
    }
    if (characterPosition.left < 0) {
        characterPosition.left = 0;
        showAlert(outboundMessage);
    }
    if (characterPosition.left + character.clientWidth > mapContainer.clientWidth) {
        characterPosition.left = mapContainer.clientWidth - character.clientWidth;
        showAlert(outboundMessage);
    }

    // Update character position on the screen
    character.style.top = `${characterPosition.top}px`;
    character.style.left = `${characterPosition.left}px`;

    // Check if the character is on a trigger event
    checkTriggerEventCollision();
}

// Display of the triggers (objects the character has to eat)
let triggeredEvents = [];
generateRandomTriggerEventPosition(50, 50, 20);

function generateRandomTriggerEventPosition(triggerWidth, triggerHeight, borderDistance) {
    triggerEvents.forEach(triggerEvent => {
        const randomTop = Math.floor(Math.random() * (mapContainer.clientHeight - triggerHeight - 2 * borderDistance)) + borderDistance;
        const randomLeft = Math.floor(Math.random() * (mapContainer.clientWidth - triggerWidth - 2 * borderDistance)) + borderDistance;

        triggerEvent.style.top = `${randomTop}px`;
        triggerEvent.style.left = `${randomLeft}px`;
    });

    // Display of rules at the begining of the game
    displayExplanations();
}

//Explanations
function displayExplanations() {
    Swal.fire({
        title: '<h4>Welcome to Clean the Garden !</h4>',
        html: document.getElementById("explainations").innerHTML,
        confirmButtonText: "Let's play !",
        confirmButtonColor: '#f08e8e',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        },
    })
}

function checkTriggerEventCollision() {
    triggerEvents.forEach(triggerEvent => {
        // Skip if the event has already been triggered
        if (triggeredEvents.includes(triggerEvent.id)) {
            return;
        }

        const triggerRect = triggerEvent.getBoundingClientRect();
        const characterRect = character.getBoundingClientRect();

        if (
            characterRect.top < triggerRect.bottom &&
            characterRect.bottom > triggerRect.top &&
            characterRect.left < triggerRect.right &&
            characterRect.right > triggerRect.left
        ) {
            // Trigger event reached
            triggeredEvents.push(triggerEvent.id);

            // Hide the trigger and update its position
            triggerEvent.style.display = 'none';

            // Check if all triggers are reached
            if (triggeredEvents.length === triggerEvents.length) {
                
                // Remove listeners when the game's over
                document.removeEventListener('touchstart', handleTouchStart);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
                document.removeEventListener('keydown', (event) => { });

                // Display the text when all triggers are reached
                Swal.fire({
                    title: 'Goooood job !',
                    html: "<p style='color: #53c757;'>You cleaned the garden !</p>",
                    icon: 'success',
                    confirmButtonText: 'Yaaaay',
                    confirmButtonColor: 'Green',
                    showClass: {
                        popup: 'animate__animated animate__fadeInDown'
                    },
                    hideClass: {
                        popup: 'animate__animated animate__fadeOutUp'
                    },
                }).then(x => {

                    // display the reward page
                    displayReward();
                    rewardKids = document.getElementById('reward-kids');
                    rewardKids.addEventListener('click', function () {
                        window.location.replace('story.html');
                    });
                })

            }
        }
    });
}

// display reward page
function displayReward() {
    character.style.display = 'none';
    mapContainer.style.display = 'none';
    gameContainer.style.display = 'block';
    gameContainer.innerHTML = `
        <h1>Congratulations </h1>
        <br>
        <h3>Here's a your reward</h3>
        <div style="background-color: rgb(233, 233, 233);"><img src="assets/gift.png" alt="gift" id="reward-kids"></div>
    `;
}

// Alert when the character tries to go outside the map
function showAlert(message) {
    isTouching = false;
    Swal.fire({
        html: `<p>${message}</p>`,
        icon: 'error',
        confirmButtonText: 'PFFF !!',
        confirmButtonColor: '#f08e8e',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        },
    });
}
