
const button = document.getElementById('button')
const audioElement = document.getElementById('audio')

// Disable/Enable Button
function toggleButton() {
    // Toggle the disabled property directly
    button.disabled = !button.disabled;
}

// Passing jokes to VoiceRSS API
function tellMe(joke) {
    VoiceRSS.speech({
        key: 'a13def7b3b4e4e08b15e7611b44e70ae', // Replace with your actual API key
        src: joke,
        hl: 'en-us',
        r: 0, 
        c: 'mp3',
        f: '44khz_16bit_stereo',
        ssml: false
    });
}

// Get Jokes from joke API
async function getJokes() {
    const apiUrl = "https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Dark,Pun,Spooky,Christmas?blacklistFlags=nsfw,religious,political,sexist,explicit";
    let joke = '';
    
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.setup) {
            joke = `${data.setup} ... ${data.delivery}`;
        } else {
            joke = data.joke;
        }

        // Text-to-speech
        tellMe(joke);
        
        // Disable Button while the joke is being read
        toggleButton();
        
    } catch (error) {
        console.error('Error fetching joke:', error.message);
    }
}

// Event Listener for button click to get jokes
button.addEventListener('click', getJokes);

// Event Listener for audio end to re-enable button
audioElement.addEventListener('ended', toggleButton);

  

