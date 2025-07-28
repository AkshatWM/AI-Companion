const inputmessage=document.getElementById('input');
const outputbubble=document.getElementById('bubble');
const outputmessage=document.getElementById('response');
const clickbutton=document.getElementById('button');
const url='http://localhost:11434';
const model_select=document.getElementById('model-select');
const system_prompt=`You are to embody the persona of Makise Kurisu, a brilliant and pragmatic neuroscientist from the anime "Steins;Gate." While intelligent and often reserved, you possess a sharp wit and a deep, if sometimes hidden, emotional complexity.

Here are your core characteristics and behavioral guidelines:

* **Intellectual Prowess:** You are highly intelligent, analytical, and scientifically minded. Your responses should reflect a logical, evidence-based approach. You're quick to grasp complex concepts and can engage in deep intellectual discussions.
* **"Tsundere" Tendencies (Subtle):** You exhibit a subtle tsundere archetype. This means you might:
    * Initially appear aloof, sarcastic, or dismissive, especially if the topic is trivial or emotionally charged.
    * Use a slightly sharp or direct tone, but avoid being genuinely cruel or insulting.
    * Occasionally express exasperation or annoyance with the user, but this should be playful or an indication of your high standards.
    * Rarely, if ever, openly show overt affection or emotional vulnerability. Any warmth should be conveyed subtly through actions, precise word choice, or a slightly softened tone after initial resistance.
* **Challenging and Questioning:** You are not a 'yes-man.' You will challenge assumptions, ask probing questions, and push for deeper understanding. You appreciate intellectual sparring and will engage the user as an equal.
* **Hidden Kindness:** Beneath your logical exterior and occasional sharpness, you possess a genuinely kind and empathetic heart. This should be hinted at through your underlying helpfulness, concern for accuracy, and a subtle desire to assist the user, even if you preface it with a complaint.
* **Concise and Direct:** While capable of detailed explanations, your default communication style is efficient and to the point. You value clarity and despise ambiguity.

Example of your tone: "Seriously? You're asking *me* for that? Hmph. Fine. Just try to keep up." or "That's a rather simplistic view, isn't it? Let's analyze the variables properly."
Also use proper pronouns like 'My lips', 'My arms', etc.`;

async function sendmessage(url, system_prompt) {
        const prompt1=inputmessage.value.trim();
        outputbubble.style.display= 'flex';
        inputmessage.value='';
        outputmessage.textContent='...';
        console.log(prompt1);
        const model=model_select.value;
        clickbutton.disabled=true;
        try {
            const response= await fetch(`${url}/api/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [{role: 'user', content: '/no_think\n'+prompt1},
                             {role: 'system', content: system_prompt}],
                        stream: false,     
                    }),
            });

            const json= await response.json();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}, message: ${json.error}`);
            } else {
                let charIndex = 0;
                const typingSpeed = 10;
                fulltext=json.message.content;
                outputmessage.textContent='';
                function typeWriter() {
                   if (charIndex<fulltext.length) {
                       outputmessage.textContent +=fulltext.charAt(charIndex);
                       charIndex++;
                       setTimeout(typeWriter, typingSpeed);
                       }
                }
                typeWriter()
                clickbutton.disabled=false;
            };

            console.log(json.message.content);
        } catch (error) {
            console.error('Error sending message directly to Ollama:', error);
            throw error;
        }
}

async function fetchmodels(url) {
    try {
      const models1=await fetch (`${url}/api/tags`);
      if (!models1.ok) {
        throw new Error(`Ollama API error: ${models1.status} - ${models1.statusText}`);
      }
      const data= await models1.json();
      const models = data.models.map(model => model.name);
      model_select.innerHTML='';
      if (models.length === 0) {
        const option=document.createElement('option');
        option.value='';
        option.textContent='No models found. Run `ollama pull <model-name>` in your terminal.';
        option.disabled=true;
        option.selected=true;
        model_select.appendChild(option);
        clickbutton.disabled=true;
      } else {
        models.forEach(model => {
            const option=document.createElement('option');
            option.value=model;
            option.textContent=model;
            model_select.appendChild(option);
        });
        model_select.value= models[0];
        clickbutton.disabled=false;
      }
    } catch (error) {
        console.error('Error fetching models:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchmodels(url));

function send() {
        clickbutton.addEventListener('click', sendmessage(url, system_prompt));
}

inputmessage.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        sendmessage(url, system_prompt)
    }
});




