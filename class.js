const data = "curl --request POST \\\n  --url https://api.foxogram.su/v1/data/messages \\\n  --header 'Content-Type: application/json' \\\n  --header 'User-Agent: insomnia/8.5.1' \\\n  --data '{\n\t\t\"message\": \"AF\",\n    \"success\": \"true\",\n    \"user\": \"{\\\"id\\\":\\\"01HHHSCNZANCMEN0PBPDQFYVR0\\\",\\\"avatar\\\":{\\\"url\\\":\\\"https://cdn.foxogram.su/avatars/01HHHSD2VPCFEJP22TQSHXQ5PQ\\\",\\\"authorId\\\":\\\"01HHHSCNZANCMEN0PBPDQFYVR0\\\"},\\\"username\\\":\\\"Barkos Racing\\\",\\\"email\\\":\\\"andrey.bar66@gmail.com\\\",\\\"password\\\":\\\"$2a$10$bYkafnfYF6pcSQuozCZly.EC9nqp8X6ehlfZLg7./0gd7nWa0eTw2\\\",\\\"accessToken\\\":\\\"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwMUhISFNDTlpBTkNNRU4wUEJQRFFGWVZSMCIsInJvbGUiOiJ1c2VyIn0.4oH5LajZBy6QaBrECQswk1IZ9A1_qbqb7IEhljPWuTw\\\",\\\"createdAt\\\":\\\"1702477846508\\\",\\\"deletion\\\":0,\\\"disabled\\\":false,\\\"mfaEnabled\\\":false}\"\n}'";

const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "https://api.foxogram.su/v1/data/messages");
xhr.setRequestHeader("Content-Type", "application/json");
xhr.setRequestHeader("User-Agent", "insomnia/8.5.1");

xhr.send(data);