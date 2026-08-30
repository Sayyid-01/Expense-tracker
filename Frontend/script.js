const form = document.getElementById('SINGUP');
const API_URL = 'http://localhost:4000/users/signup';

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const data = { name, email, password };
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            form.reset();
        } else {
            alert(result.error);
        }

    } catch (err) {
        console.error(err);
        alert("Server Error");
    }
});