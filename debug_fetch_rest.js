const url = "http://127.0.0.1:8090/api/collections/equipment/records?filter=(slug='arri-alexa-35')&expand=category";
console.log("Fetching:", url);

fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log("Items found:", data.items ? data.items.length : 0);
        if (data.items && data.items.length > 0) {
            console.log("First item:", data.items[0].id, data.items[0].name);
            console.log("Visibility:", data.items[0].visibility);
        } else {
            console.log("Full response:", JSON.stringify(data, null, 2));
        }
    })
    .catch(err => console.error("Fetch Error:", err));
