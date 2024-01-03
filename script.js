document.addEventListener('DOMContentLoaded', function() {

    if (localStorage.getItem('isLoggedIn') === 'true') {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('cookbook-container').style.display = 'block';
    } else {
        // Handle the not-logged-in scenario
    }

    
    const apiKey = 'AIzaSyBi4E-C6QqGC8XWadQMwX0ZB-Ohoz7a5_M';
    const sheetId = '16XihpA3z4QLKG-mvN8thZUWto4F55rR7GXxKD92aWvo';
    const sheetName = 'recipes';

    // Fetching data from Google Sheets API
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!A:Z?key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        const rows = data.values;
        const recipeList = document.getElementById('recipe-list');

        rows.forEach((row, index) => {
            if (index === 0) return; // Skip header row
            const title = row[0];
            const description = row[1];
            const ingredients = row[2]; // Assuming the 3rd column contains ingredients

            const recipeElem = document.createElement('div');
            recipeElem.className = 'recipe-item';
            recipeElem.dataset.ingredients = ingredients; // Store ingredients in a data attribute
            recipeElem.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
            recipeList.appendChild(recipeElem);

            recipeElem.addEventListener('click', function() {
                showRecipeDetails(row);
            });
        });
    })
    .catch(error => console.error('Error:', error));

    

    // Search by Recipe Name
    document.getElementById('searchInput').addEventListener('input', function(e) {
        searchRecipes(e.target.value.toLowerCase());
    });

    // Filter by Ingredients
    document.getElementById('ingredientSearchBtn').addEventListener('click', function() {
        const userInput = document.getElementById('ingredientInput').value.toLowerCase();
        filterByIngredients(userInput);
    });

    // Get Random Recipes
    document.getElementById('randomRecipeBtn').addEventListener('click', function() {
        const count = parseInt(document.getElementById('randomRecipeCount').value);
        getRandomRecipes(count);
    });

    function searchRecipes(searchQuery) {
        const recipeItems = document.querySelectorAll('.recipe-item');
        recipeItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            item.style.display = title.includes(searchQuery) ? '' : 'none';
        });
    }

    function filterByIngredients(userInput) {
        const userIngredients = userInput.split(',').map(ingredient => ingredient.trim().toLowerCase());
        const recipeItems = document.querySelectorAll('.recipe-item');

        recipeItems.forEach(item => {
            const recipeIngredients = item.dataset.ingredients.toLowerCase().split(',').map(ingredient => ingredient.trim());
            const isMatch = userIngredients.some(userIng => 
                recipeIngredients.some(recipeIng => recipeIng.includes(userIng))
            );
            item.style.display = isMatch ? '' : 'none';
        });
    }

    function getRandomRecipes(count) {
        const recipeItems = Array.from(document.querySelectorAll('.recipe-item'));
        if (recipeItems.length === 0 || isNaN(count) || count <= 0) {
            // Handle the case where there are no recipes or count is invalid
            return;
        }

        // Shuffling the array and slicing it to get 'count' number of recipes
        const shuffled = recipeItems.sort(() => 0.5 - Math.random());
        const selectedRecipes = shuffled.slice(0, count);

        // Display only the selected recipes
        recipeItems.forEach(item => item.style.display = 'none');
        selectedRecipes.forEach(item => item.style.display = '');
    }

    

    function showRecipeDetails(recipeData) {
        const title = recipeData[0];
        const description = recipeData[1];
        const ingredients = recipeData[2];
        const instructionText = recipeData[3];

        const instructionSteps = instructionText.split('.').filter(Boolean);
        const formattedInstructions = instructionSteps.map(step => `<li>${step.trim()}.</li><br>`).join('');

        const detailsContent = document.getElementById('recipe-details-content');
        detailsContent.innerHTML = `
            <h2>${title}</h2>
            <p>${description}</p>
            <h3>Ingredients</h3>
            <ul>${ingredients.split(',').map(ingredient => `<li>${ingredient.trim()}</li>`).join('')}</ul>
            <h3>Instructions</h3>
            <ol>${formattedInstructions}</ol>
        `;

        document.getElementById('recipe-list').style.display = 'none';
        document.getElementById('recipe-details-page').style.display = 'block';
    }

    window.backToList = function() {
        document.getElementById('recipe-list').style.display = 'block';
        document.getElementById('recipe-details-page').style.display = 'none';
    };
});

 // Toggle Chatbot
 const chatbotContainer = document.getElementById('chatbot-container');
 document.getElementById('toggleChatbotBtn').addEventListener('click', function() {
     chatbotContainer.style.display = chatbotContainer.style.display === 'block' ? 'none' : 'block';
 });





function sendChatbotMessage() {
    const inputField = document.getElementById('chatbotInput');
    const userMessage = inputField.value.trim();
    inputField.value = '';

    if (userMessage) {
        displayMessage('User', userMessage);

        // Fetch and display bot response
        const botResponse = getIngredientAlternative(userMessage);
        displayMessage('Bot', botResponse);
    }
}

function displayMessage(sender, message) {
    const chatMessages = document.getElementById('chatbot-messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = sender + ": " + message;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the latest message
}

function getIngredientAlternative(ingredientQuery) {
    const ingredient = ingredientQuery.toLowerCase();


    const alternatives = {
        'sugar': 'Alternatives: honey, maple syrup, agave nectar, stevia, coconut sugar.',
        'flour': 'Alternatives: almond flour, coconut flour, oat flour, quinoa flour, whole wheat flour.',
        'butter': 'Alternatives: margarine, coconut oil, applesauce, Greek yogurt, avocado.',
        'egg': 'Alternatives: applesauce, mashed banana, flaxseed meal, chia seeds, silken tofu.',
        'milk': 'Alternatives: almond milk, soy milk, coconut milk, oat milk, rice milk.',
        'bread crumb': 'Alternatives: rolled oats, crushed cornflakes, panko, ground almonds, pretzel crumbs.',
        'sour cream': 'Alternatives: Greek yogurt, cottage cheese, crème fraîche, coconut cream.',
        'mayonnaise': 'Alternatives: Greek yogurt, sour cream, avocado, hummus, pesto.',
        'oil': 'Alternatives: applesauce, mashed banana, Greek yogurt, pumpkin puree for baking. For frying: butter, coconut oil.',
        'chocolate chip': 'Alternatives: carob chips, peanut butter chips, chopped nuts, dried fruit, white chocolate chips.',
        'baking powder': 'Alternative: Mix ¼ teaspoon baking soda with ½ teaspoon cream of tartar.',
        'buttermilk': 'Alternative: Mix 1 cup of milk with 1 tablespoon of lemon juice or white vinegar, let stand for 10 minutes.',
        'cream cheese': 'Alternatives: Pureed cottage cheese, mascarpone, silken tofu.',
        'heavy cream': 'Alternative: Mix ¾ cup milk with ¼ cup melted butter.',
        'honey': 'Alternatives: Maple syrup, agave nectar, molasses.',
        'vinegar': 'Alternatives: Lemon or lime juice, apple cider or white wine vinegar.',
        'yogurt': 'Alternatives: Sour cream, Greek yogurt, buttermilk.',
        'tomato sauce': 'Alternatives: Canned tomatoes blended with herbs, diluted tomato paste, or a mix of ketchup and water.',
        'flour (for thickening)': 'Alternatives: Cornstarch, arrowroot powder, potato starch.',
        'baking soda': 'Alternative: Use three times the amount of baking powder.',
        'corn syrup': 'Alternatives: Honey, maple syrup, agave nectar.',
        'cream of tartar': 'Alternative: Use lemon juice or white vinegar in equal amounts.',
        'rice': 'Alternatives: Quinoa, bulgur, couscous, cauliflower rice.',
        'pasta': 'Alternatives: Zucchini noodles, spaghetti squash, whole wheat pasta, lentil or chickpea pasta.',
        'soy sauce': 'Alternatives: Tamari, coconut aminos, Worcestershire sauce.',
        // ... other alternatives
    };

    for (const key in alternatives) {
        if (ingredient.includes(key)) {
            return alternatives[key];
        }
    }

    return 'Sorry, I do not have an alternative for that.';
}


function clearChat() {
    const chatMessages = document.getElementById('chatbot-messages');
    chatMessages.innerHTML = ''; // This clears the content of the chat
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(function(error) {
      console.log('ServiceWorker registration failed: ', error);
    });
  }


// Add event listener to the chatbot send button
document.getElementById('chatbotSendBtn').addEventListener('click', sendChatbotMessage);









